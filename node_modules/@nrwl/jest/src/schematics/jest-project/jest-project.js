"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const init_1 = require("../init/init");
const check_for_test_target_1 = require("./lib/check-for-test-target");
const generate_files_1 = require("./lib/generate-files");
const update_tsconfig_1 = require("./lib/update-tsconfig");
const update_workspace_1 = require("./lib/update-workspace");
const update_jestconfig_1 = require("./lib/update-jestconfig");
const schemaDefaults = {
    setupFile: 'none',
    babelJest: false,
    supportTsx: false,
    skipSetupFile: false,
    skipSerializers: false,
};
function normalizeOptions(options) {
    if (options.testEnvironment === 'jsdom') {
        options.testEnvironment = '';
    }
    // if we support TSX or babelJest we don't support angular(html templates)
    if (options.supportTsx || options.babelJest) {
        options.skipSerializers = true;
    }
    if (!options.skipSetupFile) {
        return options;
    }
    // setupFile is always 'none'
    options.setupFile = schemaDefaults.setupFile;
    return Object.assign(Object.assign({}, schemaDefaults), options);
}
function default_1(schema) {
    const options = normalizeOptions(schema);
    return schematics_1.chain([
        init_1.default(options),
        check_for_test_target_1.checkForTestTarget(options),
        generate_files_1.generateFiles(options),
        update_tsconfig_1.updateTsConfig(options),
        update_workspace_1.updateWorkspace(options),
        update_jestconfig_1.updateJestConfig(options),
    ]);
}
exports.default = default_1;
//# sourceMappingURL=jest-project.js.map