"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const workspace_1 = require("@nrwl/workspace");
function default_1(schema) {
    return workspace_1.updateWorkspaceInTree((json) => {
        const project = json.projects[schema.project];
        if (!project) {
            throw new Error(`Invalid project name "${schema.project}"`);
        }
        project.architect = project.architect || {};
        project.architect[schema.name] = {
            builder: '@nrwl/workspace:run-commands',
            outputs: schema.outputs
                ? schema.outputs.split(',').map((s) => s.trim())
                : [],
            options: {
                command: schema.command,
                cwd: schema.cwd,
            },
        };
        return json;
    });
}
exports.default = default_1;
//# sourceMappingURL=run-commands.js.map