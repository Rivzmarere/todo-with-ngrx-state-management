"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProjectRootFiles = void 0;
const workspace_1 = require("@nrwl/workspace");
const app_root_1 = require("@nrwl/workspace/src/utils/app-root");
const path = require("path");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const utils_1 = require("./utils");
/**
 * Updates the files in the root of the project
 *
 * Typically these are config files which point outside of the project folder
 *
 * @param schema The options provided to the schematic
 */
function updateProjectRootFiles(schema) {
    return (tree, _context) => {
        return rxjs_1.from(workspace_1.getWorkspace(tree)).pipe(operators_1.map((workspace) => {
            const project = workspace.projects.get(schema.projectName);
            const destination = utils_1.getDestination(schema, workspace, tree);
            const newRelativeRoot = path
                .relative(path.join(app_root_1.appRootPath, destination), app_root_1.appRootPath)
                .split(path.sep)
                .join('/');
            const oldRelativeRoot = path
                .relative(path.join(app_root_1.appRootPath, project.root), app_root_1.appRootPath)
                .split(path.sep)
                .join('/');
            if (newRelativeRoot === oldRelativeRoot) {
                // nothing to do
                return tree;
            }
            const dots = /\./g;
            const regex = new RegExp(oldRelativeRoot.replace(dots, '\\.'), 'g');
            const isRootFile = new RegExp(`${schema.destination}/[^/]+.js*`);
            const projectDir = tree.getDir(destination);
            projectDir.visit((file) => {
                if (!isRootFile.test(file)) {
                    return;
                }
                const oldContent = tree.read(file).toString();
                const newContent = oldContent.replace(regex, newRelativeRoot);
                tree.overwrite(file, newContent);
            });
            return tree;
        }));
    };
}
exports.updateProjectRootFiles = updateProjectRootFiles;
//# sourceMappingURL=update-project-root-files.js.map