"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWorkspace = void 0;
const workspace_1 = require("@nrwl/workspace");
/**
 * Deletes the project from the workspace file
 *
 * @param schema The options provided to the schematic
 */
function updateWorkspace(schema) {
    return workspace_1.updateWorkspaceInTree((workspace, context, host) => {
        delete workspace.projects[schema.projectName];
        if (workspace.defaultProject &&
            workspace.defaultProject === schema.projectName) {
            delete workspace.defaultProject;
            const workspacePath = workspace_1.getWorkspacePath(host);
            context.logger.warn(`Default project was removed in ${workspacePath} because it was "${schema.projectName}". If you want a default project you should define a new one.`);
        }
        return workspace;
    });
}
exports.updateWorkspace = updateWorkspace;
//# sourceMappingURL=update-workspace.js.map