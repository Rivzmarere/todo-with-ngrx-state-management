"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCypressJson = void 0;
const workspace_1 = require("@nrwl/workspace");
const path = require("path");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const utils_1 = require("./utils");
/**
 * Updates the videos and screenshots folders in the cypress.json if it exists (i.e. we're moving an e2e project)
 *
 * (assume relative paths have been updated previously)
 *
 * @param schema The options provided to the schematic
 */
function updateCypressJson(schema) {
    return (tree, _context) => {
        return rxjs_1.from(workspace_1.getWorkspace(tree)).pipe(operators_1.map((workspace) => {
            const project = workspace.projects.get(schema.projectName);
            const destination = utils_1.getDestination(schema, workspace, tree);
            const cypressJsonPath = path.join(destination, 'cypress.json');
            if (!tree.exists(cypressJsonPath)) {
                // nothing to do
                return tree;
            }
            const cypressJson = JSON.parse(tree.read(cypressJsonPath).toString('utf-8'));
            cypressJson.videosFolder = cypressJson.videosFolder.replace(project.root, destination);
            cypressJson.screenshotsFolder = cypressJson.screenshotsFolder.replace(project.root, destination);
            tree.overwrite(cypressJsonPath, JSON.stringify(cypressJson));
            return tree;
        }));
    };
}
exports.updateCypressJson = updateCypressJson;
//# sourceMappingURL=update-cypress-json.js.map