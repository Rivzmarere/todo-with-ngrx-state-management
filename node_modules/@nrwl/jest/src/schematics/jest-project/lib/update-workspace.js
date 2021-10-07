"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWorkspace = void 0;
const core_1 = require("@angular-devkit/core");
const workspace_1 = require("@nrwl/workspace");
function updateWorkspace(options) {
    return workspace_1.updateWorkspaceInTree((json) => {
        var _a;
        const projectConfig = json.projects[options.project];
        projectConfig.architect.test = {
            builder: '@nrwl/jest:jest',
            options: {
                jestConfig: core_1.join(core_1.normalize(projectConfig.root), 'jest.config.js'),
                passWithNoTests: true,
            },
        };
        const isUsingTSLint = ((_a = projectConfig.architect.lint) === null || _a === void 0 ? void 0 : _a.builder) ===
            '@angular-devkit/build-angular:tslint';
        if (isUsingTSLint) {
            projectConfig.architect.lint.options.tsConfig = [
                ...projectConfig.architect.lint.options.tsConfig,
                core_1.join(core_1.normalize(projectConfig.root), 'tsconfig.spec.json'),
            ];
        }
        return json;
    });
}
exports.updateWorkspace = updateWorkspace;
//# sourceMappingURL=update-workspace.js.map