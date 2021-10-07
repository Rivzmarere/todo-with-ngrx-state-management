"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveProject = void 0;
const workspace_1 = require("@nrwl/workspace");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const utils_1 = require("./utils");
/**
 * Moves a project to the given destination path
 *
 * @param schema The options provided to the schematic
 */
function moveProject(schema) {
    return (tree, _context) => {
        return rxjs_1.from(workspace_1.getWorkspace(tree)).pipe(operators_1.map((workspace) => {
            const project = workspace.projects.get(schema.projectName);
            const destination = utils_1.getDestination(schema, workspace, tree);
            const dir = tree.getDir(project.root);
            dir.visit((file) => {
                const newPath = file.replace(project.root, destination);
                tree.create(newPath, tree.read(file));
            });
            tree.delete(project.root);
            return tree;
        }));
    };
}
exports.moveProject = moveProject;
//# sourceMappingURL=move-project.js.map