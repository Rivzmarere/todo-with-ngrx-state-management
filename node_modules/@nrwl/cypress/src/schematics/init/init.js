"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const versions_1 = require("../../utils/versions");
const workspace_1 = require("@nrwl/workspace");
function updateDependencies() {
    return (host) => {
        const packageJson = workspace_1.readJsonInTree(host, 'package.json');
        const devDependencies = Object.assign({}, packageJson.devDependencies);
        const dependencies = Object.assign({}, packageJson.dependencies);
        if (!devDependencies['cypress']) {
            devDependencies['cypress'] = versions_1.cypressVersion;
        }
        if (!devDependencies['@nrwl/cypress']) {
            devDependencies['@nrwl/cypress'] = versions_1.nxVersion;
        }
        if (packageJson.dependencies['@nrwl/cypress']) {
            delete dependencies['@nrwl/cypress'];
        }
        return workspace_1.updateJsonInTree('package.json', (json) => {
            json.dependencies = dependencies;
            json.devDependencies = devDependencies;
            return json;
        });
    };
}
function default_1(schema) {
    return updateDependencies();
}
exports.default = default_1;
//# sourceMappingURL=init.js.map