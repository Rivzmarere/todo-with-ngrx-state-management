"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateJestConfig = void 0;
const workspace_1 = require("@nrwl/workspace");
const path = require("path");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const utils_1 = require("./utils");
/**
 * Updates the project name and coverage folder in the jest.config.js if it exists
 *
 * (assume relative paths have been updated previously)
 *
 * @param schema The options provided to the schematic
 */
function updateJestConfig(schema) {
    return (tree, _context) => {
        return rxjs_1.from(workspace_1.getWorkspace(tree)).pipe(operators_1.map((workspace) => {
            const project = workspace.projects.get(schema.projectName);
            const destination = utils_1.getDestination(schema, workspace, tree);
            const newProjectName = utils_1.getNewProjectName(schema.destination);
            const jestConfigPath = path.join(destination, 'jest.config.js');
            if (!tree.exists(jestConfigPath)) {
                // nothing to do
                return tree;
            }
            const oldContent = tree.read(jestConfigPath).toString('utf-8');
            const findName = new RegExp(`'${schema.projectName}'`, 'g');
            const findDir = new RegExp(project.root, 'g');
            const newContent = oldContent
                .replace(findName, `'${newProjectName}'`)
                .replace(findDir, destination);
            tree.overwrite(jestConfigPath, newContent);
            return tree;
        }));
    };
}
exports.updateJestConfig = updateJestConfig;
//# sourceMappingURL=update-jest-config.js.map