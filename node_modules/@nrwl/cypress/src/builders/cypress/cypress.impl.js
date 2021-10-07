"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startDevServer = exports.cypressBuilderRunner = void 0;
const tslib_1 = require("tslib");
const architect_1 = require("@angular-devkit/architect");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const internal_compatibility_1 = require("rxjs/internal-compatibility");
const path_1 = require("path");
const workspace_1 = require("@nrwl/workspace");
const legacy_1 = require("./legacy");
const literals_1 = require("@angular-devkit/core/src/utils/literals");
const cypress_version_1 = require("../../utils/cypress-version");
const yargsParser = require("yargs-parser");
const Cypress = require('cypress'); // @NOTE: Importing via ES6 messes the whole test dependencies.
try {
    require('dotenv').config();
}
catch (e) { }
exports.default = architect_1.createBuilder(cypressBuilderRunner);
/**
 * @whatItDoes This is the starting point of the builder.
 * @param options
 * @param context
 */
function cypressBuilderRunner(options, context) {
    // Special handling of extra options coming through Angular CLI
    if (options['--']) {
        const _a = yargsParser(options['--'], {
            configuration: { 'camel-case-expansion': false },
        }), { _ } = _a, overrides = tslib_1.__rest(_a, ["_"]);
        options = Object.assign(Object.assign({}, options), overrides);
    }
    const legacy = isLegacy(options, context);
    if (legacy) {
        showLegacyWarning(context);
    }
    options.env = options.env || {};
    if (options.tsConfig) {
        options.env.tsConfig = path_1.join(context.workspaceRoot, options.tsConfig);
    }
    checkSupportedBrowser(options, context);
    return (!legacy
        ? options.devServerTarget
            ? startDevServer(options.devServerTarget, options.watch, context).pipe(operators_1.map((devServerBaseUrl) => options.baseUrl || devServerBaseUrl))
            : rxjs_1.of(options.baseUrl)
        : legacy_1.legacyCompile(options, context)).pipe(operators_1.concatMap((baseUrl) => initCypress(options.cypressConfig, options.headless, options.exit, options.record, options.key, options.parallel, options.watch, baseUrl, options.browser, options.env, options.spec, options.ciBuildId, options.group, options.ignoreTestFiles, options.reporter, options.reporterOptions)), options.watch ? operators_1.tap(rxjs_1.noop) : operators_1.take(1), operators_1.catchError((error) => {
        context.reportStatus(`Error: ${error.message}`);
        context.logger.error(error.message);
        return rxjs_1.of({
            success: false,
        });
    }));
}
exports.cypressBuilderRunner = cypressBuilderRunner;
/**
 * @whatItDoes Initialize the Cypress test runner with the provided project configuration.
 * If `headless` is `false`: open the Cypress application, the user will
 * be able to interact directly with the application.
 * If `headless` is `true`: Cypress will run in headless mode and will
 * provide directly the results in the console output.
 * @param cypressConfig
 * @param headless
 * @param exit
 * @param record
 * @param key
 * @param parallel
 * @param baseUrl
 * @param isWatching
 * @param browser
 * @param env
 * @param spec
 * @param ciBuildId
 * @param group
 * @param ignoreTestFiles
 */
function initCypress(cypressConfig, headless, exit, record, key, parallel, isWatching, baseUrl, browser, env, spec, ciBuildId, group, ignoreTestFiles, reporter, reporterOptions) {
    // Cypress expects the folder where a `cypress.json` is present
    const projectFolderPath = path_1.dirname(cypressConfig);
    const options = {
        project: projectFolderPath,
        configFile: path_1.basename(cypressConfig),
    };
    // If not, will use the `baseUrl` normally from `cypress.json`
    if (baseUrl) {
        options.config = { baseUrl: baseUrl };
    }
    if (browser) {
        options.browser = browser;
    }
    if (env) {
        options.env = env;
    }
    if (spec) {
        options.spec = spec;
    }
    options.exit = exit;
    options.headed = !headless;
    options.headless = headless;
    options.record = record;
    options.key = key;
    options.parallel = parallel;
    options.ciBuildId = ciBuildId;
    options.group = group;
    options.ignoreTestFiles = ignoreTestFiles;
    options.reporter = reporter;
    options.reporterOptions = reporterOptions;
    return internal_compatibility_1.fromPromise(!isWatching || headless ? Cypress.run(options) : Cypress.open(options)).pipe(
    // tap(() => (isWatching && !headless ? process.exit() : null)), // Forcing `cypress.open` to give back the terminal
    operators_1.map((result) => ({
        /**
         * `cypress.open` is returning `0` and is not of the same type as `cypress.run`.
         * `cypress.open` is the graphical UI, so it will be obvious to know what wasn't
         * working. Forcing the build to success when `cypress.open` is used.
         */
        success: !result.totalFailed && !result.failures,
    })));
}
/**
 * @whatItDoes Compile the application using the webpack builder.
 * @param devServerTarget
 * @param isWatching
 * @param context
 * @private
 */
function startDevServer(devServerTarget, isWatching, context) {
    // Overrides dev server watch setting.
    const overrides = {
        watch: isWatching,
    };
    return architect_1.scheduleTargetAndForget(context, architect_1.targetFromTargetString(devServerTarget), overrides).pipe(operators_1.map((output) => {
        if (!output.success && !isWatching) {
            throw new Error('Could not compile application files');
        }
        return output.baseUrl;
    }));
}
exports.startDevServer = startDevServer;
function isLegacy(options, context) {
    const tsconfigJson = workspace_1.readJsonFile(path_1.join(context.workspaceRoot, options.tsConfig));
    const cypressConfigPath = path_1.join(context.workspaceRoot, options.cypressConfig);
    const cypressJson = workspace_1.readJsonFile(cypressConfigPath);
    if (!cypressJson.integrationFolder) {
        throw new Error(`"integrationFolder" is not defined in ${options.cypressConfig}`);
    }
    const integrationFolder = path_1.join(path_1.dirname(cypressConfigPath), cypressJson.integrationFolder);
    const tsOutDirPath = path_1.join(context.workspaceRoot, path_1.dirname(options.tsConfig), tsconfigJson.compilerOptions.outDir);
    return !path_1.relative(tsOutDirPath, integrationFolder).startsWith('..');
}
function showLegacyWarning(context) {
    context.logger.warn(literals_1.stripIndents `
  Warning:
  You are using the legacy configuration for cypress.
  Please run "ng update @nrwl/cypress --from 8.1.0 --to 8.2.0 --migrate-only".`);
}
function checkSupportedBrowser({ browser }, context) {
    // Browser was not passed in as an option, cypress will use whatever default it has set and we dont need to check it
    if (!browser) {
        return;
    }
    if (cypress_version_1.installedCypressVersion() >= 4 && browser == 'canary') {
        context.logger.warn(literals_1.stripIndents `
  Warning:
  You are using a browser that is not supported by cypress v4+.

  Read here for more info:
  https://docs.cypress.io/guides/references/migration-guide.html#Launching-Chrome-Canary-with-browser
  `);
        return;
    }
    const supportedV3Browsers = ['electron', 'chrome', 'canary', 'chromium'];
    if (cypress_version_1.installedCypressVersion() <= 3 &&
        !supportedV3Browsers.includes(browser)) {
        context.logger.warn(literals_1.stripIndents `
    Warning:
    You are using a browser that is not supported by cypress v3.
    `);
        return;
    }
}
//# sourceMappingURL=cypress.impl.js.map