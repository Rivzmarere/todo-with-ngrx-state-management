"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.validateTargetAndConfiguration = void 0;
const tslib_1 = require("tslib");
const architect_1 = require("@angular-devkit/architect");
const node_1 = require("@angular-devkit/architect/node");
const core_1 = require("@angular-devkit/core");
const node_2 = require("@angular-devkit/core/node");
const minimist = require("minimist");
const logger_1 = require("../shared/logger");
const params_1 = require("../shared/params");
const print_help_1 = require("../shared/print-help");
function throwInvalidInvocation() {
    throw new Error(`Specify the project name and the target (e.g., ${print_help_1.commandName} run proj:build)`);
}
function parseRunOpts(args, defaultProjectName, logger) {
    const runOptions = params_1.convertToCamelCase(minimist(args, {
        boolean: ['help', 'prod'],
        string: ['configuration', 'project'],
    }));
    const help = runOptions.help;
    if (!runOptions._ || !runOptions._[0]) {
        throwInvalidInvocation();
    }
    // eslint-disable-next-line prefer-const
    let [project, target, configuration] = runOptions._[0].split(':');
    if (!project && defaultProjectName) {
        logger.debug(`No project name specified. Using default project : ${core_1.terminal.bold(defaultProjectName)}`);
        project = defaultProjectName;
    }
    if (runOptions.configuration) {
        configuration = runOptions.configuration;
    }
    if (runOptions.prod) {
        configuration = 'production';
    }
    if (runOptions.project) {
        project = runOptions.project;
    }
    if (!project || !target) {
        throwInvalidInvocation();
    }
    const res = { project, target, configuration, help, runOptions };
    delete runOptions['help'];
    delete runOptions['_'];
    delete runOptions['configuration'];
    delete runOptions['prod'];
    delete runOptions['project'];
    return res;
}
function printRunHelp(opts, schema, logger) {
    print_help_1.printHelp(`${print_help_1.commandName} run ${opts.project}:${opts.target}`, schema, logger);
}
function validateTargetAndConfiguration(workspace, opts) {
    const architect = workspace.projects.get(opts.project);
    if (!architect) {
        throw new Error(`Could not find project "${opts.project}"`);
    }
    const targets = architect.targets;
    const availableTargets = [...targets.keys()];
    const target = targets.get(opts.target);
    if (!target) {
        throw new Error(`Could not find target "${opts.target}" in the ${opts.project} project. Valid targets are: ${core_1.terminal.bold(availableTargets.join(', '))}`);
    }
    // Not all targets have configurations
    // and an undefined configuration is valid
    if (opts.configuration) {
        if (target.configurations) {
            const configuration = target.configurations[opts.configuration];
            if (!configuration) {
                throw new Error(`Could not find configuration "${opts.configuration}" in ${opts.project}:${opts.target}. Valid configurations are: ${Object.keys(target.configurations).join(', ')}`);
            }
        }
        else {
            throw new Error(`No configurations are defined for ${opts.project}:${opts.target}, so "${opts.configuration}" is invalid.`);
        }
    }
}
exports.validateTargetAndConfiguration = validateTargetAndConfiguration;
function normalizeOptions(opts, schema) {
    return params_1.convertAliases(params_1.coerceTypes(opts, schema), schema, false);
}
function run(root, args, isVerbose) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const logger = logger_1.getLogger(isVerbose);
        return params_1.handleErrors(logger, isVerbose, () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const fsHost = new node_2.NodeJsSyncHost();
            const { workspace } = yield core_1.workspaces.readWorkspace('workspace.json', core_1.workspaces.createWorkspaceHost(fsHost));
            const opts = parseRunOpts(args, workspace.extensions['defaultProject'], logger);
            validateTargetAndConfiguration(workspace, opts);
            const registry = new core_1.json.schema.CoreSchemaRegistry();
            registry.addPostTransform(core_1.schema.transforms.addUndefinedDefaults);
            const architectHost = new node_1.WorkspaceNodeModulesArchitectHost(workspace, root);
            const architect = new architect_1.Architect(architectHost, registry);
            const builderConf = yield architectHost.getBuilderNameForTarget({
                project: opts.project,
                target: opts.target,
            });
            const builderDesc = yield architectHost.resolveBuilder(builderConf);
            const flattenedSchema = yield registry
                .flatten(builderDesc.optionSchema)
                .toPromise();
            if (opts.help) {
                printRunHelp(opts, flattenedSchema, logger);
                return 0;
            }
            const runOptions = normalizeOptions(opts.runOptions, flattenedSchema);
            const run = yield architect.scheduleTarget({
                project: opts.project,
                target: opts.target,
                configuration: opts.configuration,
            }, runOptions, { logger });
            const result = yield run.output.toPromise();
            yield run.stop();
            return result.success ? 0 : 1;
        }));
    });
}
exports.run = run;
//# sourceMappingURL=run.js.map