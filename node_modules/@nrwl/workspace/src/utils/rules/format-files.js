"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatFiles = void 0;
const tslib_1 = require("tslib");
const schematics_1 = require("@angular-devkit/schematics");
let prettier;
try {
    prettier = require('prettier');
}
catch (e) { }
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const path = require("path");
const app_root_1 = require("../app-root");
function formatFiles(options = { skipFormat: false }) {
    if (options.skipFormat || !prettier) {
        return schematics_1.noop();
    }
    return (host, context) => {
        const files = new Set(host.actions
            .filter((action) => action.kind !== 'd' && action.kind !== 'r')
            .map((action) => ({
            path: action.path,
            content: action.content.toString(),
        })));
        if (files.size === 0) {
            return host;
        }
        return rxjs_1.from(files).pipe(operators_1.filter((file) => host.exists(file.path)), operators_1.mergeMap((file) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const systemPath = path.join(app_root_1.appRootPath, file.path);
            let options = {
                filepath: systemPath,
            };
            const resolvedOptions = yield prettier.resolveConfig(systemPath);
            if (resolvedOptions) {
                options = Object.assign(Object.assign({}, options), resolvedOptions);
            }
            const support = yield prettier.getFileInfo(systemPath, options);
            if (support.ignored || !support.inferredParser) {
                return;
            }
            try {
                host.overwrite(file.path, prettier.format(file.content, options));
            }
            catch (e) {
                context.logger.warn(`Could not format ${file.path} because ${e.message}`);
            }
        })), operators_1.map(() => host));
    };
}
exports.formatFiles = formatFiles;
//# sourceMappingURL=format-files.js.map