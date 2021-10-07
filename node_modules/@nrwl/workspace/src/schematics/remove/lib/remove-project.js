"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeProject = void 0;
const workspace_1 = require("@nrwl/workspace");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
/**
 * Removes (deletes) a project from the folder tree
 *
 * @param schema The options provided to the schematic
 */
function removeProject(schema) {
    return (tree, _context) => {
        return rxjs_1.from(workspace_1.getWorkspace(tree)).pipe(operators_1.map((workspace) => {
            const project = workspace.projects.get(schema.projectName);
            tree.delete(project.root);
            return tree;
        }));
    };
}
exports.removeProject = removeProject;
//# sourceMappingURL=remove-project.js.map