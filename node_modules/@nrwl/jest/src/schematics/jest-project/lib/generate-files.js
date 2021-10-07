"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFiles = void 0;
const schematics_1 = require("@angular-devkit/schematics");
const workspace_1 = require("@nrwl/workspace");
function generateFiles(options) {
    return (tree, _context) => {
        const projectConfig = workspace_1.getProjectConfig(tree, options.project);
        return schematics_1.mergeWith(schematics_1.apply(schematics_1.url('./files'), [
            schematics_1.template(Object.assign(Object.assign({ tmpl: '' }, options), { transformer: options.babelJest ? 'babel-jest' : 'ts-jest', projectRoot: projectConfig.root, offsetFromRoot: workspace_1.offsetFromRoot(projectConfig.root) })),
            options.setupFile === 'none'
                ? schematics_1.filter((file) => file !== '/src/test-setup.ts')
                : schematics_1.noop(),
            options.babelJest
                ? schematics_1.noop()
                : schematics_1.filter((file) => file != '/babel-jest.config.json'),
            schematics_1.move(projectConfig.root),
        ]));
    };
}
exports.generateFiles = generateFiles;
//# sourceMappingURL=generate-files.js.map