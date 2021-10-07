"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateImports = void 0;
const workspace_1 = require("@nrwl/workspace");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const utils_1 = require("./utils");
/**
 * Updates all the imports in the workspace and modifies the tsconfig appropriately.
 *
 * @param schema The options provided to the schematic
 */
function updateImports(schema) {
    return (tree, _context) => {
        return rxjs_1.from(workspace_1.getWorkspace(tree)).pipe(operators_1.map((workspace) => {
            var _a;
            const nxJson = workspace_1.readJsonInTree(tree, 'nx.json');
            const libsDir = ((_a = nxJson.workspaceLayout) === null || _a === void 0 ? void 0 : _a.libsDir) ? nxJson.workspaceLayout.libsDir
                : 'libs';
            const project = workspace.projects.get(schema.projectName);
            if (project.extensions['projectType'] === 'application') {
                // These shouldn't be imported anywhere?
                return tree;
            }
            // use the source root to find the from location
            // this attempts to account for libs that have been created with --importPath
            const tsConfigPath = 'tsconfig.base.json';
            let tsConfig;
            let fromPath;
            if (tree.exists(tsConfigPath)) {
                tsConfig = JSON.parse(tree.read(tsConfigPath).toString('utf-8'));
                fromPath = Object.keys(tsConfig.compilerOptions.paths).find((path) => tsConfig.compilerOptions.paths[path].some((x) => x.startsWith(project.sourceRoot)));
            }
            const projectRef = {
                from: fromPath ||
                    utils_1.normalizeSlashes(`@${nxJson.npmScope}/${project.root.substr(libsDir.length + 1)}`),
                to: schema.importPath ||
                    utils_1.normalizeSlashes(`@${nxJson.npmScope}/${schema.destination}`),
            };
            if (schema.updateImportPath) {
                const replaceProjectRef = new RegExp(projectRef.from, 'g');
                for (const [name, definition] of workspace.projects.entries()) {
                    if (name === schema.projectName) {
                        continue;
                    }
                    const projectDir = tree.getDir(definition.root);
                    projectDir.visit((file) => {
                        const contents = tree.read(file).toString('utf-8');
                        if (!replaceProjectRef.test(contents)) {
                            return;
                        }
                        const updatedFile = tree
                            .read(file)
                            .toString()
                            .replace(replaceProjectRef, projectRef.to);
                        tree.overwrite(file, updatedFile);
                    });
                }
            }
            const projectRoot = {
                from: project.root.substr(libsDir.length + 1),
                to: schema.destination,
            };
            if (tsConfig) {
                const path = tsConfig.compilerOptions.paths[projectRef.from];
                if (!path) {
                    throw new Error([
                        `unable to find "${projectRef.from}" in`,
                        `${tsConfigPath} compilerOptions.paths`,
                    ].join(' '));
                }
                const updatedPath = path.map((x) => x.replace(new RegExp(projectRoot.from, 'g'), projectRoot.to));
                if (schema.updateImportPath) {
                    tsConfig.compilerOptions.paths[projectRef.to] = updatedPath;
                    delete tsConfig.compilerOptions.paths[projectRef.from];
                }
                else {
                    tsConfig.compilerOptions.paths[projectRef.from] = updatedPath;
                }
                tree.overwrite(tsConfigPath, workspace_1.serializeJson(tsConfig));
            }
            return tree;
        }));
    };
}
exports.updateImports = updateImports;
//# sourceMappingURL=update-imports.js.map