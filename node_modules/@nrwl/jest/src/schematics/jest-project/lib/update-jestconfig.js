"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateJestConfig = void 0;
const tslib_1 = require("tslib");
const workspace_1 = require("@nrwl/workspace");
const update_config_1 = require("../../../utils/config/update-config");
function updateJestConfig(options) {
    return (host) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const workspace = yield workspace_1.getWorkspace(host);
        const project = workspace.projects.get(options.project);
        update_config_1.addPropertyToJestConfig(host, 'jest.config.js', 'projects', `<rootDir>/${project.root}`);
    });
}
exports.updateJestConfig = updateJestConfig;
//# sourceMappingURL=update-jestconfig.js.map