"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectHasTargetAndConfiguration = exports.projectHasTarget = void 0;
function projectHasTarget(project, target) {
    return (project.data && project.data.architect && project.data.architect[target]);
}
exports.projectHasTarget = projectHasTarget;
function projectHasTargetAndConfiguration(project, target, configuration) {
    return (projectHasTarget(project, target) &&
        project.data.architect[target].configurations &&
        project.data.architect[target].configurations[configuration]);
}
exports.projectHasTargetAndConfiguration = projectHasTargetAndConfiguration;
//# sourceMappingURL=project-graph-utils.js.map