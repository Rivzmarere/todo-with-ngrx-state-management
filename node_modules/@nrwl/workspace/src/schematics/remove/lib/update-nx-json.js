"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNxJson = void 0;
const workspace_1 = require("@nrwl/workspace");
/**
 * Updates the nx.json file to remove the project
 *
 * @param schema The options provided to the schematic
 */
function updateNxJson(schema) {
    return workspace_1.updateJsonInTree('nx.json', (json) => {
        delete json.projects[schema.projectName];
        Object.values(json.projects).forEach((project) => {
            if (project.implicitDependencies) {
                project.implicitDependencies = project.implicitDependencies.filter((dep) => dep !== schema.projectName);
            }
        });
        return json;
    });
}
exports.updateNxJson = updateNxJson;
//# sourceMappingURL=update-nx-json.js.map