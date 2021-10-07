"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const core_1 = require("@angular-devkit/core");
// app
const workspace_1 = require("@nrwl/workspace");
const to_js_1 = require("@nrwl/workspace/src/utils/rules/to-js");
const ast_utils_1 = require("@nrwl/workspace/src/utils/ast-utils");
const versions_1 = require("../../utils/versions");
function generateFiles(options) {
    return () => {
        return schematics_1.mergeWith(schematics_1.apply(schematics_1.url('./files'), [
            schematics_1.template(Object.assign(Object.assign({ tmpl: '' }, options), { ext: options.js ? 'js' : 'ts', offsetFromRoot: workspace_1.offsetFromRoot(options.projectRoot) })),
            schematics_1.move(options.projectRoot),
            options.js ? to_js_1.toJS() : schematics_1.noop(),
        ]));
    };
}
function updateNxJson(options) {
    return workspace_1.updateJsonInTree('nx.json', (json) => {
        json.projects[options.projectName] = {
            tags: [],
        };
        if (options.project) {
            json.projects[options.projectName].implicitDependencies = [
                options.project,
            ];
        }
        return json;
    });
}
function updateWorkspaceJson(options) {
    return workspace_1.updateWorkspaceInTree((json) => {
        const architect = {};
        architect.e2e = {
            builder: '@nrwl/cypress:cypress',
            options: {
                cypressConfig: core_1.join(core_1.normalize(options.projectRoot), 'cypress.json'),
                tsConfig: core_1.join(core_1.normalize(options.projectRoot), 'tsconfig.e2e.json'),
                devServerTarget: `${options.project}:serve`,
            },
            configurations: {
                production: {
                    devServerTarget: `${options.project}:serve:production`,
                },
            },
        };
        architect.lint = workspace_1.generateProjectLint(core_1.normalize(options.projectRoot), core_1.join(core_1.normalize(options.projectRoot), 'tsconfig.e2e.json'), options.linter, [`${options.projectRoot}/**/*.${options.js ? 'js' : '{js,ts}'}`]);
        json.projects[options.projectName] = {
            root: options.projectRoot,
            sourceRoot: core_1.join(core_1.normalize(options.projectRoot), 'src'),
            projectType: 'application',
            architect,
        };
        return json;
    });
}
function addLinter(options) {
    return schematics_1.chain([
        options.linter === "eslint" /* EsLint */
            ? workspace_1.addDepsToPackageJson({}, { 'eslint-plugin-cypress': versions_1.eslintPluginCypressVersion })
            : schematics_1.noop(),
        workspace_1.addLintFiles(options.projectRoot, options.linter, {
            localConfig: {
                extends: ['plugin:cypress/recommended'],
                // we need this overrides because we enabled
                // allowJS in the tsconfig to allow for JS based
                // Cypress tests. That however leads to issues
                // with the CommonJS Cypress plugin file
                overrides: [
                    {
                        files: ['src/plugins/index.js'],
                        rules: {
                            '@typescript-eslint/no-var-requires': 'off',
                            'no-undef': 'off',
                        },
                    },
                ],
            },
        }),
    ]);
}
function default_1(options) {
    return (host, context) => {
        options = normalizeOptions(host, options);
        return schematics_1.chain([
            addLinter(options),
            generateFiles(options),
            updateWorkspaceJson(options),
            updateNxJson(options),
        ])(host, context);
    };
}
exports.default = default_1;
function normalizeOptions(host, options) {
    const projectName = options.directory
        ? workspace_1.toFileName(options.directory) + '-' + options.name
        : options.name;
    const projectRoot = options.directory
        ? core_1.join(core_1.normalize(ast_utils_1.appsDir(host)), workspace_1.toFileName(options.directory), options.name)
        : core_1.join(core_1.normalize(ast_utils_1.appsDir(host)), options.name);
    return Object.assign(Object.assign({}, options), { projectName,
        projectRoot });
}
//# sourceMappingURL=cypress-project.js.map