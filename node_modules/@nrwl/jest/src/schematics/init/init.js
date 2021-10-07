"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const literals_1 = require("@angular-devkit/core/src/utils/literals");
const schematics_1 = require("@angular-devkit/schematics");
const workspace_1 = require("@nrwl/workspace");
const rxjs_1 = require("rxjs");
const versions_1 = require("../../utils/versions");
const schemaDefaults = {
    babelJest: false,
};
const removeNrwlJestFromDeps = (host) => {
    // check whether updating the package.json is necessary
    const currentPackageJson = workspace_1.readJsonInTree(host, 'package.json');
    if (currentPackageJson.dependencies &&
        currentPackageJson.dependencies['@nrwl/jest']) {
        return workspace_1.updateJsonInTree('package.json', (json) => {
            json.dependencies = json.dependencies || {};
            delete json.dependencies['@nrwl/jest'];
            return json;
        });
    }
    else {
        return rxjs_1.noop();
    }
};
const createJestConfig = (host) => {
    if (!host.exists('jest.config.js')) {
        host.create('jest.config.js', literals_1.stripIndents `
  module.exports = {
    projects: []
  };`);
    }
    if (!host.exists('jest.preset.js')) {
        host.create('jest.preset.js', `
      const nxPreset = require('@nrwl/jest/preset');
     
      module.exports = { ...nxPreset }`);
    }
};
function updateDependencies(options) {
    const devDeps = {
        '@nrwl/jest': versions_1.nxVersion,
        jest: versions_1.jestVersion,
        '@types/jest': versions_1.jestTypesVersion,
        'ts-jest': versions_1.tsJestVersion,
    };
    if (options.babelJest) {
        devDeps['@babel/core'] = versions_1.babelCoreVersion;
        devDeps['@babel/preset-env'] = versions_1.babelPresetEnvVersion;
        devDeps['@babel/preset-typescript'] = versions_1.babelPresetTypescriptVersion;
        devDeps['@babel/preset-react'] = versions_1.babelPresetReactVersion;
        devDeps['babel-jest'] = versions_1.babelJestVersion;
    }
    return workspace_1.addDepsToPackageJson({}, devDeps);
}
function updateExtensions(host, context) {
    if (!host.exists('.vscode/extensions.json')) {
        return;
    }
    return workspace_1.updateJsonInTree('.vscode/extensions.json', (json) => {
        json.recommendations = json.recommendations || [];
        const extension = 'firsttris.vscode-jest-runner';
        if (!json.recommendations.includes(extension)) {
            json.recommendations.push(extension);
        }
        return json;
    })(host, context);
}
function default_1(schema) {
    const options = normalizeOptions(schema);
    return schematics_1.chain([
        createJestConfig,
        updateDependencies(options),
        removeNrwlJestFromDeps,
        updateExtensions,
    ]);
}
exports.default = default_1;
function normalizeOptions(options) {
    return Object.assign(Object.assign({}, schemaDefaults), options);
}
//# sourceMappingURL=init.js.map