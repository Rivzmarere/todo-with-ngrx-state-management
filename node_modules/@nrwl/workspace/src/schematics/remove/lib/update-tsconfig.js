"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTsconfig = void 0;
const workspace_1 = require("@nrwl/workspace");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
/**
 * Updates the tsconfig paths to remove the project.
 *
 * @param schema The options provided to the schematic
 */
function updateTsconfig(schema) {
    return (tree, _context) => {
        return rxjs_1.from(workspace_1.getWorkspace(tree)).pipe(operators_1.map((workspace) => {
            const nxJson = workspace_1.readJsonInTree(tree, 'nx.json');
            const project = workspace.projects.get(schema.projectName);
            const tsConfigPath = 'tsconfig.base.json';
            if (tree.exists(tsConfigPath)) {
                const tsConfigJson = workspace_1.readJsonInTree(tree, tsConfigPath);
                delete tsConfigJson.compilerOptions.paths[`@${nxJson.npmScope}/${project.root.substr(5)}`];
                tree.overwrite(tsConfigPath, workspace_1.serializeJson(tsConfigJson));
            }
            return tree;
        }));
    };
}
exports.updateTsconfig = updateTsconfig;
//# sourceMappingURL=update-tsconfig.js.map