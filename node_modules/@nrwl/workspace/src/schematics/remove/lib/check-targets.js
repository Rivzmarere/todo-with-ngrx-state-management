"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkTargets = void 0;
const workspace_1 = require("@nrwl/workspace");
/**
 * Check whether the project to be removed has builders targetted by another project
 *
 * Throws an error if the project is in use, unless the `--forceRemove` option is used.
 *
 * @param schema The options provided to the schematic
 */
function checkTargets(schema) {
    if (schema.forceRemove) {
        return (tree) => tree;
    }
    return workspace_1.updateWorkspaceInTree((workspace) => {
        const findTarget = new RegExp(`${schema.projectName}:`);
        const usedIn = [];
        for (const name of Object.keys(workspace.projects)) {
            if (name === schema.projectName) {
                continue;
            }
            const projectStr = JSON.stringify(workspace.projects[name]);
            if (findTarget.test(projectStr)) {
                usedIn.push(name);
            }
        }
        if (usedIn.length > 0) {
            let message = `${schema.projectName} is still targeted by the following projects:\n\n`;
            for (let project of usedIn) {
                message += `${project}\n`;
            }
            throw new Error(message);
        }
        return workspace;
    });
}
exports.checkTargets = checkTargets;
//# sourceMappingURL=check-targets.js.map