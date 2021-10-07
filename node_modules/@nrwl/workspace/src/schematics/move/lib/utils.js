"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeSlashes = exports.getNewProjectName = exports.getDestination = exports.getWorkspaceLayout = void 0;
const ast_utils_1 = require("@nrwl/workspace/src/utils/ast-utils");
const path = require("path");
/**
 * This helper function retrieves the users workspace layout from
 * `nx.json`. If the user does not have this property defined then
 * we assume the default `apps/` and `libs/` layout.
 *
 * @param host The host tree
 */
function getWorkspaceLayout(host) {
    const nxJson = ast_utils_1.readJsonInTree(host, 'nx.json');
    const workspaceLayout = nxJson.workspaceLayout
        ? nxJson.workspaceLayout
        : { appsDir: 'apps', libsDir: 'libs' };
    return workspaceLayout;
}
exports.getWorkspaceLayout = getWorkspaceLayout;
/**
 * This helper function ensures that we don't move libs or apps
 * outside of the folders they should be in.
 *
 * This will break if someone isn't using the default libs/apps
 * folders. In that case, they're on their own :/
 *
 * @param schema
 * @param workspace
 */
function getDestination(schema, workspace, host) {
    const project = workspace.projects.get
        ? workspace.projects.get(schema.projectName)
        : workspace.projects[schema.projectName];
    const projectType = project.extensions
        ? project.extensions['projectType']
        : project.projectType;
    const workspaceLayout = getWorkspaceLayout(host);
    let rootFolder = workspaceLayout.libsDir;
    if (projectType === 'application') {
        rootFolder = workspaceLayout.appsDir;
    }
    return path.join(rootFolder, schema.destination).split(path.sep).join('/');
}
exports.getDestination = getDestination;
/**
 * Replaces slashes with dashes
 *
 * @param path
 */
function getNewProjectName(path) {
    return path.replace(/\//g, '-');
}
exports.getNewProjectName = getNewProjectName;
/**
 * Normalizes slashes (removes duplicates)
 *
 * @param input
 */
function normalizeSlashes(input) {
    return input
        .split('/')
        .filter((x) => !!x)
        .join('/');
}
exports.normalizeSlashes = normalizeSlashes;
//# sourceMappingURL=utils.js.map