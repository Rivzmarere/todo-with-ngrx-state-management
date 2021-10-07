"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNxJson = void 0;
const workspace_1 = require("@nrwl/workspace");
const utils_1 = require("./utils");
/**
 * Updates the nx.json file by renaming the project
 *
 * @param schema The options provided to the schematic
 */
function updateNxJson(schema) {
    return workspace_1.updateJsonInTree('nx.json', (json) => {
        Object.values(json.projects).forEach((project) => {
            if (project.implicitDependencies) {
                const index = project.implicitDependencies.indexOf(schema.projectName);
                if (index !== -1) {
                    project.implicitDependencies[index] = utils_1.getNewProjectName(schema.destination);
                }
            }
        });
        json.projects[utils_1.getNewProjectName(schema.destination)] = Object.assign({}, json.projects[schema.projectName]);
        delete json.projects[schema.projectName];
        return json;
    });
}
exports.updateNxJson = updateNxJson;
//# sourceMappingURL=update-nx-json.js.map