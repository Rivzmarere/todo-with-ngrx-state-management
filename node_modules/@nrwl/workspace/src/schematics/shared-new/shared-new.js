"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sharedNew = void 0;
const schematics_1 = require("@angular-devkit/schematics");
const tasks_1 = require("@angular-devkit/schematics/tasks");
const ast_utils_1 = require("../../utils/ast-utils");
const name_utils_1 = require("../../utils/name-utils");
const format_files_1 = require("../../utils/rules/format-files");
const versions_1 = require("../../utils/versions");
const path = require("path");
const rxjs_1 = require("rxjs");
const child_process_1 = require("child_process");
const detect_package_manager_1 = require("../../utils/detect-package-manager");
// @ts-ignore
const yargsParser = require("yargs-parser");
class RunPresetTask {
    toConfiguration() {
        return {
            name: 'RunPreset',
        };
    }
}
function createPresetTaskExecutor(cli, opts) {
    const cliCommand = cli === 'angular' ? 'ng' : 'nx';
    const parsedArgs = yargsParser(process.argv, {
        boolean: ['interactive'],
    });
    return {
        name: 'RunPreset',
        create: () => {
            return Promise.resolve(() => {
                const spawnOptions = {
                    stdio: [process.stdin, process.stdout, process.stderr],
                    shell: true,
                    cwd: path.join(opts.nxWorkspaceRoot || process.cwd(), opts.directory),
                };
                const executable = `${detect_package_manager_1.getPackageManagerExecuteCommand()} ${cliCommand}`;
                const args = [
                    `g`,
                    `@nrwl/workspace:preset`,
                    `--name=${opts.appName}`,
                    opts.style ? `--style=${opts.style}` : null,
                    opts.npmScope
                        ? `--npmScope=${opts.npmScope}`
                        : `--npmScope=${opts.name}`,
                    opts.preset ? `--preset=${opts.preset}` : null,
                    `--cli=${cliCommand}`,
                    parsedArgs.interactive ? '--interactive=true' : '--interactive=false',
                ].filter((e) => !!e);
                return new rxjs_1.Observable((obs) => {
                    child_process_1.spawn(executable, args, spawnOptions).on('close', (code) => {
                        if (code === 0) {
                            obs.next();
                            obs.complete();
                        }
                        else {
                            const message = 'Workspace creation failed, see above.';
                            obs.error(new Error(message));
                        }
                    });
                });
            });
        },
    };
}
function sharedNew(cli, options) {
    if (options.skipInstall &&
        options.preset !== 'empty' &&
        options.preset !== 'oss') {
        throw new Error(`Cannot select a preset when skipInstall is set to true.`);
    }
    if (options.skipInstall && options.nxCloud) {
        throw new Error(`Cannot select nxCloud when skipInstall is set to true.`);
    }
    options = normalizeOptions(options);
    const layout = options.preset === 'oss' ? 'packages' : 'apps-and-libs';
    const workspaceOpts = Object.assign(Object.assign({}, options), { layout, preset: undefined, nxCloud: undefined });
    return (host, context) => {
        const engineHost = context.engine.workflow.engineHost;
        engineHost.registerTaskExecutor(createPresetTaskExecutor(cli, options));
        return schematics_1.chain([
            schematics_1.schematic('workspace', Object.assign(Object.assign({}, workspaceOpts), { cli })),
            setDefaultLinter(options),
            addPresetDependencies(options),
            addCloudDependencies(options),
            schematics_1.move('/', options.directory),
            addTasks(options),
            format_files_1.formatFiles(),
        ])(schematics_1.Tree.empty(), context);
    };
}
exports.sharedNew = sharedNew;
function addCloudDependencies(options) {
    return options.nxCloud
        ? ast_utils_1.addDepsToPackageJson({}, { '@nrwl/nx-cloud': 'latest' }, false)
        : schematics_1.noop();
}
function addPresetDependencies(options) {
    if (options.preset === 'empty') {
        return schematics_1.noop();
    }
    else if (options.preset === 'web-components') {
        return ast_utils_1.addDepsToPackageJson({}, {
            '@nrwl/web': versions_1.nxVersion,
        }, false);
    }
    else if (options.preset === 'angular') {
        return ast_utils_1.addDepsToPackageJson({
            '@nrwl/angular': versions_1.nxVersion,
        }, {}, false);
    }
    else if (options.preset === 'angular-nest') {
        return ast_utils_1.addDepsToPackageJson({
            '@nrwl/angular': versions_1.nxVersion,
        }, {
            '@nrwl/nest': versions_1.nxVersion,
        }, false);
    }
    else if (options.preset === 'react') {
        return ast_utils_1.addDepsToPackageJson({}, {
            '@nrwl/react': versions_1.nxVersion,
        }, false);
    }
    else if (options.preset === 'react-express') {
        return ast_utils_1.addDepsToPackageJson({}, {
            '@nrwl/react': versions_1.nxVersion,
            '@nrwl/express': versions_1.nxVersion,
        }, false);
    }
    else if (options.preset === 'next') {
        return ast_utils_1.addDepsToPackageJson({}, {
            '@nrwl/next': versions_1.nxVersion,
        }, false);
    }
    else if (options.preset === 'nest') {
        return ast_utils_1.addDepsToPackageJson({}, {
            '@nrwl/nest': versions_1.nxVersion,
        }, false);
    }
    else {
        return schematics_1.noop();
    }
}
function addTasks(options) {
    return (host, context) => {
        let packageTask;
        let presetInstallTask;
        if (!options.skipInstall) {
            packageTask = context.addTask(new tasks_1.NodePackageInstallTask(options.directory));
        }
        if (options.preset !== 'empty') {
            const createPresetTask = context.addTask(new RunPresetTask(), [
                packageTask,
            ]);
            presetInstallTask = context.addTask(new tasks_1.NodePackageInstallTask(options.directory), [createPresetTask]);
        }
        if (!options.skipGit) {
            const commit = typeof options.commit == 'object'
                ? options.commit
                : !!options.commit
                    ? {}
                    : false;
            context.addTask(new tasks_1.RepositoryInitializerTask(options.directory, commit), presetInstallTask
                ? [presetInstallTask]
                : packageTask
                    ? [packageTask]
                    : []);
        }
    };
}
function normalizeOptions(options) {
    options.name = name_utils_1.toFileName(options.name);
    if (!options.directory) {
        options.directory = options.name;
    }
    return options;
}
function setDefaultLinter({ linter, preset }) {
    // Don't do anything if someone doesn't pick angular
    if (preset === 'angular' || preset === 'angular-nest') {
        switch (linter) {
            case 'eslint': {
                return setESLintDefault();
            }
            case 'tslint': {
                return setTSLintDefault();
            }
            default: {
                return schematics_1.noop();
            }
        }
    }
    else {
        return schematics_1.noop();
    }
}
/**
 * This sets ESLint as the default for any schematics that default to TSLint
 */
function setESLintDefault() {
    return ast_utils_1.updateWorkspaceInTree((json) => {
        if (!json.schematics) {
            json.schematics = {};
        }
        json.schematics['@nrwl/angular'] = {
            application: { linter: 'eslint' },
            library: { linter: 'eslint' },
            'storybook-configuration': { linter: 'eslint' },
        };
        return json;
    });
}
/**
 * This sets TSLint as the default for any schematics that default to ESLint
 */
function setTSLintDefault() {
    return ast_utils_1.updateWorkspaceInTree((json) => {
        if (!json.schematics) {
            json.schematics = {};
        }
        json.schematics['@nrwl/workspace'] = { library: { linter: 'tslint' } };
        json.schematics['@nrwl/cypress'] = {
            'cypress-project': { linter: 'tslint' },
        };
        json.schematics['@nrwl/node'] = {
            application: { linter: 'tslint' },
            library: { linter: 'tslint' },
        };
        json.schematics['@nrwl/nest'] = {
            application: { linter: 'tslint' },
            library: { linter: 'tslint' },
        };
        json.schematics['@nrwl/express'] = {
            application: { linter: 'tslint' },
            library: { linter: 'tslint' },
        };
        return json;
    });
}
//# sourceMappingURL=shared-new.js.map