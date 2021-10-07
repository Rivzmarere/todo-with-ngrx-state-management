"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.report = exports.packagesWeCareAbout = void 0;
const core_1 = require("@angular-devkit/core");
const fs_1 = require("fs");
const app_root_1 = require("../utils/app-root");
const output_1 = require("../utils/output");
exports.packagesWeCareAbout = [
    'nx',
    '@nrwl/angular',
    '@nrwl/cli',
    '@nrwl/cypress',
    '@nrwl/eslint-plugin-nx',
    '@nrwl/express',
    '@nrwl/jest',
    '@nrwl/linter',
    '@nrwl/nest',
    '@nrwl/next',
    '@nrwl/node',
    '@nrwl/react',
    '@nrwl/schematics',
    '@nrwl/tao',
    '@nrwl/web',
    '@nrwl/workspace',
    'typescript',
];
exports.report = {
    command: 'report',
    describe: 'Reports useful version numbers to copy into the Nx issue template',
    builder: (yargs) => yargs,
    handler: reportHandler,
};
/**
 * Reports relevant version numbers for adding to an Nx issue report
 *
 * @remarks
 *
 * Must be run within an Nx workspace
 *
 */
function reportHandler() {
    const bodyLines = [];
    exports.packagesWeCareAbout.forEach((p) => {
        let status = 'Not Found';
        try {
            const packageJsonPath = require.resolve(`${p}/package.json`, {
                paths: [app_root_1.appRootPath],
            });
            const packageJson = JSON.parse(fs_1.readFileSync(packageJsonPath).toString());
            status = packageJson.version;
        }
        catch (_a) { }
        bodyLines.push(`${core_1.terminal.green(p)} : ${core_1.terminal.bold(status)}`);
    });
    output_1.output.log({
        title: 'Report complete - copy this into the issue template',
        bodyLines,
    });
}
//# sourceMappingURL=report.js.map