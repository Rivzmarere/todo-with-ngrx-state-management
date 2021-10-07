"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listInstalledPlugins = exports.getInstalledPluginsFromPackageJson = void 0;
const core_1 = require("@angular-devkit/core");
const fileutils_1 = require("../fileutils");
const output_1 = require("../output");
const plugin_capabilities_1 = require("./plugin-capabilities");
const shared_1 = require("./shared");
function getInstalledPluginsFromPackageJson(workspaceRoot, corePlugins, communityPlugins) {
    const packageJson = fileutils_1.readJsonFile(`${workspaceRoot}/package.json`);
    const plugins = new Set([
        ...corePlugins.map((p) => p.name),
        ...communityPlugins.map((p) => p.name),
        ...Object.keys(packageJson.dependencies || {}),
        ...Object.keys(packageJson.devDependencies || {}),
    ]);
    return [...plugins]
        .filter((name) => {
        try {
            // Check for `package.json` existence instead of requiring the module itself
            // because malformed entries like `main`, may throw false exceptions.
            require.resolve(`${name}/package.json`, { paths: [workspaceRoot] });
            return true;
        }
        catch (_a) {
            return false;
        }
    })
        .sort()
        .map((name) => plugin_capabilities_1.getPluginCapabilities(workspaceRoot, name))
        .filter((x) => x && !!(x.schematics || x.builders));
}
exports.getInstalledPluginsFromPackageJson = getInstalledPluginsFromPackageJson;
function listInstalledPlugins(installedPlugins) {
    output_1.output.log({
        title: `Installed plugins:`,
        bodyLines: installedPlugins.map((p) => {
            const capabilities = [];
            if (shared_1.hasElements(p.builders)) {
                capabilities.push('builders');
            }
            if (shared_1.hasElements(p.schematics)) {
                capabilities.push('schematics');
            }
            return `${core_1.terminal.bold(p.name)} (${capabilities.join()})`;
        }),
    });
}
exports.listInstalledPlugins = listInstalledPlugins;
//# sourceMappingURL=installed-plugins.js.map