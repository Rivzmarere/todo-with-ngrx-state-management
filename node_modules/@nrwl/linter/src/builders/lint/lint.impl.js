"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const architect_1 = require("@angular-devkit/architect");
const fs_1 = require("fs");
const path = require("path");
const ts_utils_1 = require("./utility/ts-utils");
const eslint_utils_1 = require("./utility/eslint-utils");
const workspace_1 = require("@nrwl/workspace");
/**
 * Adapted from @angular-eslint/builder source
 */
function run(options, context) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (options.linter === 'tslint') {
            throw new Error(`'tslint' option is no longer supported. Update your angular.json to use "@angular-eslint/builder:lint" builder directly.`);
        }
        const systemRoot = context.workspaceRoot;
        process.chdir(context.currentDirectory);
        const projectName = (context.target && context.target.project) || '<???>';
        const printInfo = options.format && !options.silent;
        context.reportStatus(`Linting ${JSON.stringify(projectName)}...`);
        if (printInfo) {
            context.logger.info(`\nLinting ${JSON.stringify(projectName)}...`);
        }
        const projectESLint = yield eslint_utils_1.loadESLint();
        const version = projectESLint.Linter.version &&
            projectESLint.Linter.version.split('.');
        if (!version ||
            version.length < 2 ||
            Number(version[0]) < 6 ||
            (Number(version[0]) === 6 && Number(version[1]) < 1)) {
            throw new Error('ESLint must be version 6.1 or higher.');
        }
        // We want users to have the option of not specifying the config path, and let
        // eslint automatically resolve the `.eslintrc.json` files in each folder.
        const eslintConfigPath = options.config
            ? path.resolve(systemRoot, options.config)
            : undefined;
        let lintReports = [];
        const lintedFiles = new Set();
        if (options.tsConfig) {
            const tsConfigs = Array.isArray(options.tsConfig)
                ? options.tsConfig
                : [options.tsConfig];
            context.reportProgress(0, tsConfigs.length);
            const allPrograms = tsConfigs.map((tsConfig) => ts_utils_1.createProgram(path.resolve(systemRoot, tsConfig)));
            let i = 0;
            for (const program of allPrograms) {
                lintReports = [
                    ...lintReports,
                    ...(yield eslint_utils_1.lint(systemRoot, eslintConfigPath, options, lintedFiles, program, allPrograms)),
                ];
                context.reportProgress(++i, allPrograms.length);
            }
        }
        else {
            lintReports = [
                ...lintReports,
                ...(yield eslint_utils_1.lint(systemRoot, eslintConfigPath, options, lintedFiles)),
            ];
        }
        if (lintReports.length === 0) {
            throw new Error('Invalid lint configuration. Nothing to lint.');
        }
        const formatter = projectESLint.CLIEngine.getFormatter(options.format);
        const bundledReport = {
            errorCount: 0,
            fixableErrorCount: 0,
            fixableWarningCount: 0,
            warningCount: 0,
            results: [],
            usedDeprecatedRules: [],
        };
        for (const report of lintReports) {
            // output fixes to disk
            projectESLint.CLIEngine.outputFixes(report);
            if (report.errorCount || report.warningCount) {
                bundledReport.errorCount += report.errorCount;
                bundledReport.warningCount += report.warningCount;
                bundledReport.fixableErrorCount += report.fixableErrorCount;
                bundledReport.fixableWarningCount += report.fixableWarningCount;
                bundledReport.results.push(...report.results);
                bundledReport.usedDeprecatedRules.push(...report.usedDeprecatedRules);
            }
        }
        const formattedResults = formatter(bundledReport.results);
        context.logger.info(formattedResults);
        if (options.outputFile) {
            const pathToFile = path.join(context.workspaceRoot, options.outputFile);
            workspace_1.createDirectory(path.dirname(pathToFile));
            fs_1.writeFileSync(pathToFile, formattedResults);
        }
        if (bundledReport.warningCount > 0 && printInfo) {
            context.logger.warn('Lint warnings found in the listed files.\n');
        }
        if (bundledReport.errorCount > 0 && printInfo) {
            context.logger.error('Lint errors found in the listed files.\n');
        }
        if (bundledReport.warningCount === 0 &&
            bundledReport.errorCount === 0 &&
            printInfo) {
            context.logger.info('All files pass linting.\n');
        }
        return {
            success: options.force ||
                (bundledReport.errorCount === 0 &&
                    (options.maxWarnings === -1 ||
                        bundledReport.warningCount <= options.maxWarnings)),
        };
    });
}
exports.default = architect_1.createBuilder(run);
//# sourceMappingURL=lint.impl.js.map