"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWorkspace = void 0;
const workspace_1 = require("@nrwl/workspace");
const utils_1 = require("./utils");
/**
 * Updates the project in the workspace file
 *
 * - update all references to the old root path
 * - change the project name
 * - change target references
 *
 * @param schema The options provided to the schematic
 */
function updateWorkspace(schema) {
    return (tree, _context) => {
        return workspace_1.updateWorkspaceInTree((workspace) => {
            const project = workspace.projects[schema.projectName];
            const newProjectName = utils_1.getNewProjectName(schema.destination);
            // update root path refs in that project only
            const oldProject = JSON.stringify(project);
            const newProject = oldProject.replace(new RegExp(project.root, 'g'), utils_1.getDestination(schema, workspace, tree));
            // rename
            delete workspace.projects[schema.projectName];
            workspace.projects[newProjectName] = JSON.parse(newProject);
            // update target refs
            const strWorkspace = JSON.stringify(workspace);
            workspace = JSON.parse(strWorkspace.replace(new RegExp(`${schema.projectName}:`, 'g'), `${newProjectName}:`));
            // update default project (if necessary)
            if (workspace.defaultProject &&
                workspace.defaultProject === schema.projectName) {
                workspace.defaultProject = newProjectName;
            }
            return workspace;
        });
    };
}
exports.updateWorkspace = updateWorkspace;
//# sourceMappingURL=update-workspace.js.map