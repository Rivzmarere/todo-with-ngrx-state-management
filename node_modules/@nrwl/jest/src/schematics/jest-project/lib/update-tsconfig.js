"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTsConfig = void 0;
const core_1 = require("@angular-devkit/core");
const workspace_1 = require("@nrwl/workspace");
function updateTsConfig(options) {
    return (host) => {
        const projectConfig = workspace_1.getProjectConfig(host, options.project);
        if (!host.exists(core_1.join(projectConfig.root, 'tsconfig.json'))) {
            throw new Error(`Expected ${core_1.join(projectConfig.root, 'tsconfig.json')} to exist. Please create one.`);
        }
        return workspace_1.updateJsonInTree(core_1.join(projectConfig.root, 'tsconfig.json'), (json) => {
            if (json.references) {
                json.references.push({
                    path: './tsconfig.spec.json',
                });
            }
            return json;
        });
    };
}
exports.updateTsConfig = updateTsConfig;
//# sourceMappingURL=update-tsconfig.js.map