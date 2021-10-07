"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_NRWL_PRETTIER_CONFIG = void 0;
const schematics_1 = require("@angular-devkit/schematics");
const core_1 = require("@angular-devkit/core");
const versions_1 = require("../../utils/versions");
const fs_1 = require("fs");
const path_1 = require("path");
const workspace_1 = require("@nrwl/workspace");
exports.DEFAULT_NRWL_PRETTIER_CONFIG = {
    singleQuote: true,
};
const decorateAngularClI = (host) => {
    const decorateCli = fs_1.readFileSync(path_1.join(__dirname, '..', 'utils', 'decorate-angular-cli.js__tmpl__')).toString();
    host.create('decorate-angular-cli.js', decorateCli);
};
function setWorkspaceLayoutProperties(options) {
    return workspace_1.updateJsonInTree('nx.json', (json) => {
        if (options.layout === 'packages') {
            json.workspaceLayout = {
                appsDir: 'packages',
                libsDir: 'packages',
            };
        }
        return json;
    });
}
function createAppsAndLibsFolders(options) {
    return (host) => {
        if (options.layout === 'packages') {
            host.create('packages/.gitkeep', '');
        }
        else {
            host.create('apps/.gitkeep', '');
            host.create('libs/.gitkeep', '');
        }
    };
}
function default_1(options) {
    if (!options.name) {
        throw new Error(`Invalid options, "name" is required.`);
    }
    return (host, context) => {
        const npmScope = options.npmScope ? options.npmScope : options.name;
        const templateSource = schematics_1.apply(schematics_1.url('./files'), [
            schematics_1.template(Object.assign(Object.assign({ utils: core_1.strings, dot: '.', tmpl: '', workspaceFile: options.cli === 'angular' ? 'angular' : 'workspace', cliCommand: options.cli === 'angular' ? 'ng' : 'nx', nxCli: false, typescriptVersion: versions_1.typescriptVersion,
                prettierVersion: versions_1.prettierVersion,
                eslintVersion: versions_1.eslintVersion,
                // angular cli is used only when workspace schematics is added to angular cli
                angularCliVersion: versions_1.angularCliVersion }, options), { nxVersion: versions_1.nxVersion,
                npmScope, defaultNrwlPrettierConfig: JSON.stringify(exports.DEFAULT_NRWL_PRETTIER_CONFIG, null, 2) })),
        ]);
        return schematics_1.chain([
            schematics_1.branchAndMerge(schematics_1.chain([
                schematics_1.mergeWith(templateSource),
                options.cli === 'angular' ? decorateAngularClI : schematics_1.noop(),
                setWorkspaceLayoutProperties(options),
                createAppsAndLibsFolders(options),
            ])),
        ])(host, context);
    };
}
exports.default = default_1;
//# sourceMappingURL=workspace.js.map