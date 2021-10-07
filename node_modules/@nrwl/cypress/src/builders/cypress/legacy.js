"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.legacyCompile = void 0;
const child_process_1 = require("child_process");
const workspace_1 = require("@nrwl/workspace");
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const operators_1 = require("rxjs/operators");
const rxjs_1 = require("rxjs");
const treeKill = require("tree-kill");
const cypress_impl_1 = require("./cypress.impl");
let tscProcess;
function legacyCompile(options, context) {
    const tsconfigJson = workspace_1.readJsonFile(path_1.join(context.workspaceRoot, options.tsConfig));
    // Cleaning the /dist folder
    fs_extra_1.removeSync(path_1.join(path_1.dirname(options.tsConfig), tsconfigJson.compilerOptions.outDir));
    return compileTypescriptFiles(options.tsConfig, options.watch, context).pipe(operators_1.tap(() => {
        copyCypressFixtures(options.cypressConfig, context);
        copyIntegrationFilesByRegex(options.cypressConfig, context, options.copyFiles);
    }), operators_1.concatMap(() => options.devServerTarget
        ? cypress_impl_1.startDevServer(options.devServerTarget, options.watch, context)
        : rxjs_1.of(options.baseUrl)));
}
exports.legacyCompile = legacyCompile;
/**
 * @whatItDoes Compile typescript spec files to be able to run Cypress.
 * The compilation is done via executing the `tsc` command line/
 * @param tsConfigPath
 * @param isWatching
 */
function compileTypescriptFiles(tsConfigPath, isWatching, context) {
    if (tscProcess) {
        killProcess(context);
    }
    return rxjs_1.Observable.create((subscriber) => {
        try {
            let args = ['-p', path_1.join(context.workspaceRoot, tsConfigPath)];
            const tscPath = path_1.join(context.workspaceRoot, '/node_modules/typescript/bin/tsc');
            if (isWatching) {
                args.push('--watch');
                tscProcess = child_process_1.fork(tscPath, args, { stdio: [0, 1, 2, 'ipc'] });
                subscriber.next({ success: true });
            }
            else {
                tscProcess = child_process_1.fork(tscPath, args, { stdio: [0, 1, 2, 'ipc'] });
                tscProcess.on('exit', (code) => {
                    code === 0
                        ? subscriber.next({ success: true })
                        : subscriber.error('Could not compile Typescript files');
                    subscriber.complete();
                });
            }
        }
        catch (error) {
            if (tscProcess) {
                killProcess(context);
            }
            subscriber.error(new Error(`Could not compile Typescript files: \n ${error}`));
        }
    });
}
function copyCypressFixtures(cypressConfigPath, context) {
    const cypressConfig = workspace_1.readJsonFile(path_1.join(context.workspaceRoot, cypressConfigPath));
    // DOn't copy fixtures if cypress config does not have it set
    if (!cypressConfig.fixturesFolder) {
        return;
    }
    fs_extra_1.copySync(`${path_1.dirname(path_1.join(context.workspaceRoot, cypressConfigPath))}/src/fixtures`, path_1.join(path_1.dirname(path_1.join(context.workspaceRoot, cypressConfigPath)), cypressConfig.fixturesFolder), { overwrite: true });
}
/**
 * @whatItDoes Copy all the integration files that match the given regex into the dist folder.
 * This is done because `tsc` doesn't handle all file types, e.g. Cucumbers `feature` files.
 * @param fileExtension File extension to copy
 */
function copyIntegrationFilesByRegex(cypressConfigPath, context, regex) {
    const cypressConfig = workspace_1.readJsonFile(path_1.join(context.workspaceRoot, cypressConfigPath));
    if (!regex || !cypressConfig.integrationFolder) {
        return;
    }
    const regExp = new RegExp(regex);
    fs_extra_1.copySync(`${path_1.dirname(path_1.join(context.workspaceRoot, cypressConfigPath))}/src/integration`, path_1.join(path_1.dirname(path_1.join(context.workspaceRoot, cypressConfigPath)), cypressConfig.integrationFolder), { filter: (file) => regExp.test(file) });
}
function killProcess(context) {
    return treeKill(tscProcess.pid, 'SIGTERM', (error) => {
        tscProcess = null;
        if (error) {
            if (Array.isArray(error) && error[0] && error[2]) {
                const errorMessage = error[2];
                context.logger.error(errorMessage);
            }
            else if (error.message) {
                context.logger.error(error.message);
            }
        }
    });
}
//# sourceMappingURL=legacy.js.map