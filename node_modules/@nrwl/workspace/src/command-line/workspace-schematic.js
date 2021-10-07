"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workspaceSchematic = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular-devkit/core");
const node_1 = require("@angular-devkit/core/node");
const schematics_1 = require("@angular-devkit/schematics");
const tools_1 = require("@angular-devkit/schematics/tools");
const child_process_1 = require("child_process");
const fs = require("fs");
const fs_1 = require("fs");
const fs_extra_1 = require("fs-extra");
const inquirer = require("inquirer");
const path = require("path");
const yargsParser = require("yargs-parser");
const app_root_1 = require("../utils/app-root");
const detect_package_manager_1 = require("../utils/detect-package-manager");
const fileutils_1 = require("../utils/fileutils");
const output_1 = require("../utils/output");
const rootDirectory = app_root_1.appRootPath;
function workspaceSchematic(args) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const outDir = compileTools();
        const parsedArgs = parseOptions(args, outDir);
        const logger = node_1.createConsoleLogger(parsedArgs.verbose, process.stdout, process.stderr);
        if (parsedArgs.listSchematics) {
            return listSchematics(path.join(outDir, 'workspace-schematics.json'), logger);
        }
        const schematicName = args[0];
        const workflow = createWorkflow(parsedArgs.dryRun);
        try {
            yield executeSchematic(schematicName, parsedArgs, workflow, outDir, logger);
        }
        catch (e) {
            process.exit(1);
        }
    });
}
exports.workspaceSchematic = workspaceSchematic;
// compile tools
function compileTools() {
    const toolsOutDir = getToolsOutDir();
    fs_extra_1.removeSync(toolsOutDir);
    compileToolsDir(toolsOutDir);
    const schematicsOutDir = path.join(toolsOutDir, 'schematics');
    const collectionData = constructCollection();
    saveCollection(schematicsOutDir, collectionData);
    return schematicsOutDir;
}
function getToolsOutDir() {
    return path.resolve(toolsDir(), toolsTsConfig().compilerOptions.outDir);
}
function compileToolsDir(outDir) {
    fs_extra_1.copySync(schematicsDir(), path.join(outDir, 'schematics'));
    const tmpTsConfigPath = createTmpTsConfig(toolsTsConfigPath(), {
        include: [path.join(schematicsDir(), '**/*.ts')],
    });
    const packageExec = detect_package_manager_1.getPackageManagerExecuteCommand();
    const tsc = `${packageExec} tsc`;
    try {
        child_process_1.execSync(`${tsc} -p ${tmpTsConfigPath}`, {
            stdio: 'inherit',
            cwd: rootDirectory,
        });
    }
    catch (e) {
        process.exit(1);
    }
}
function constructCollection() {
    const schematics = {};
    fs.readdirSync(schematicsDir()).forEach((c) => {
        const childDir = path.join(schematicsDir(), c);
        if (exists(path.join(childDir, 'schema.json'))) {
            schematics[c] = {
                factory: `./${c}`,
                schema: `./${path.join(c, 'schema.json')}`,
                description: `Schematic ${c}`,
            };
        }
    });
    return {
        name: 'workspace-schematics',
        version: '1.0',
        schematics,
    };
}
function saveCollection(dir, collection) {
    fs_1.writeFileSync(path.join(dir, 'workspace-schematics.json'), JSON.stringify(collection));
}
function schematicsDir() {
    return path.join(rootDirectory, 'tools', 'schematics');
}
function toolsDir() {
    return path.join(rootDirectory, 'tools');
}
function toolsTsConfigPath() {
    return path.join(toolsDir(), 'tsconfig.tools.json');
}
function toolsTsConfig() {
    return fileutils_1.readJsonFile(toolsTsConfigPath());
}
function createWorkflow(dryRun) {
    const root = core_1.normalize(rootDirectory);
    const host = new core_1.virtualFs.ScopedHost(new node_1.NodeJsSyncHost(), root);
    return new tools_1.NodeWorkflow(host, {
        packageManager: detect_package_manager_1.detectPackageManager(),
        root,
        dryRun,
        registry: new core_1.schema.CoreSchemaRegistry(schematics_1.formats.standardFormats),
        resolvePaths: [process.cwd(), rootDirectory],
    });
}
function listSchematics(collectionName, logger) {
    try {
        const engineHost = new tools_1.NodeModulesEngineHost();
        const engine = new schematics_1.SchematicEngine(engineHost);
        const collection = engine.createCollection(collectionName);
        logger.info(engine.listSchematicNames(collection).join('\n'));
    }
    catch (error) {
        logger.fatal(error.message);
        return 1;
    }
    return 0;
}
function createPromptProvider() {
    return (definitions) => {
        const questions = definitions.map((definition) => {
            const question = {
                name: definition.id,
                message: definition.message,
                default: definition.default,
            };
            const validator = definition.validator;
            if (validator) {
                question.validate = (input) => validator(input);
            }
            switch (definition.type) {
                case 'confirmation':
                    return Object.assign(Object.assign({}, question), { type: 'confirm' });
                case 'list':
                    return Object.assign(Object.assign({}, question), { type: !!definition.multiselect ? 'checkbox' : 'list', choices: definition.items &&
                            definition.items.map((item) => {
                                if (typeof item == 'string') {
                                    return item;
                                }
                                else {
                                    return {
                                        name: item.label,
                                        value: item.value,
                                    };
                                }
                            }) });
                default:
                    return Object.assign(Object.assign({}, question), { type: definition.type });
            }
        });
        return inquirer.prompt(questions);
    };
}
// execute schematic
function executeSchematic(schematicName, options, workflow, outDir, logger) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        output_1.output.logSingleLine(`${output_1.output.colors.gray(`Executing your local schematic`)}: ${schematicName}`);
        let nothingDone = true;
        let loggingQueue = [];
        let hasError = false;
        workflow.reporter.subscribe((event) => {
            nothingDone = false;
            const eventPath = event.path.startsWith('/')
                ? event.path.substr(1)
                : event.path;
            switch (event.kind) {
                case 'error':
                    hasError = true;
                    const desc = event.description == 'alreadyExist'
                        ? 'already exists'
                        : 'does not exist.';
                    logger.warn(`ERROR! ${eventPath} ${desc}.`);
                    break;
                case 'update':
                    loggingQueue.push(core_1.tags.oneLine `${core_1.terminal.white('UPDATE')} ${eventPath} (${event.content.length} bytes)`);
                    break;
                case 'create':
                    loggingQueue.push(core_1.tags.oneLine `${core_1.terminal.green('CREATE')} ${eventPath} (${event.content.length} bytes)`);
                    break;
                case 'delete':
                    loggingQueue.push(core_1.tags.oneLine `${core_1.terminal.yellow('DELETE')} ${eventPath}`);
                    break;
                case 'rename':
                    const eventToPath = event.to.startsWith('/')
                        ? event.to.substr(1)
                        : event.to;
                    loggingQueue.push(core_1.tags.oneLine `${core_1.terminal.blue('RENAME')} ${eventPath} => ${eventToPath}`);
                    break;
            }
        });
        workflow.lifeCycle.subscribe((event) => {
            if (event.kind === 'workflow-end' || event.kind === 'post-tasks-start') {
                if (!hasError) {
                    loggingQueue.forEach((log) => logger.info(log));
                }
                loggingQueue = [];
                hasError = false;
            }
        });
        const args = options._.slice(1);
        workflow.registry.addSmartDefaultProvider('argv', (schema) => {
            if ('index' in schema) {
                return args[+schema.index];
            }
            else {
                return args;
            }
        });
        delete options._;
        if (options.defaults) {
            workflow.registry.addPreTransform(core_1.schema.transforms.addUndefinedDefaults);
        }
        else {
            workflow.registry.addPostTransform(core_1.schema.transforms.addUndefinedDefaults);
        }
        workflow.engineHost.registerOptionsTransform(tools_1.validateOptionsWithSchema(workflow.registry));
        // Add support for interactive prompts
        if (options.interactive) {
            workflow.registry.usePromptProvider(createPromptProvider());
        }
        try {
            yield workflow
                .execute({
                collection: path.join(outDir, 'workspace-schematics.json'),
                schematic: schematicName,
                options: options,
                logger: logger,
            })
                .toPromise();
            if (nothingDone) {
                logger.info('Nothing to be done.');
            }
            if (options.dryRun) {
                logger.warn(`\nNOTE: The "dryRun" flag means no changes were made.`);
            }
        }
        catch (err) {
            if (err instanceof schematics_1.UnsuccessfulWorkflowExecution) {
                // "See above" because we already printed the error.
                logger.fatal('The Schematic workflow failed. See above.');
            }
            else {
                logger.fatal(err.stack || err.message);
            }
            throw err;
        }
    });
}
function parseOptions(args, outDir) {
    const schemaPath = path.join(outDir, args[0], 'schema.json');
    let booleanProps = [];
    if (fileutils_1.fileExists(schemaPath)) {
        const { properties } = fileutils_1.readJsonFile(path.join(outDir, args[0], 'schema.json'));
        if (properties) {
            booleanProps = Object.keys(properties).filter((key) => properties[key].type === 'boolean');
        }
    }
    return yargsParser(args, {
        boolean: ['dryRun', 'listSchematics', 'interactive', ...booleanProps],
        alias: {
            dryRun: ['d'],
            listSchematics: ['l'],
        },
        default: {
            interactive: true,
        },
    });
}
function exists(file) {
    try {
        return !!fs.statSync(file);
    }
    catch (e) {
        return false;
    }
}
function createTmpTsConfig(tsconfigPath, updateConfig) {
    const tmpTsConfigPath = path.join(path.dirname(tsconfigPath), 'tsconfig.generated.json');
    const originalTSConfig = fileutils_1.readJsonFile(tsconfigPath);
    const generatedTSConfig = Object.assign(Object.assign({}, originalTSConfig), updateConfig);
    process.on('exit', () => {
        cleanupTmpTsConfigFile(tmpTsConfigPath);
    });
    process.on('SIGTERM', () => {
        cleanupTmpTsConfigFile(tmpTsConfigPath);
        process.exit(0);
    });
    process.on('SIGINT', () => {
        cleanupTmpTsConfigFile(tmpTsConfigPath);
        process.exit(0);
    });
    fileutils_1.writeJsonFile(tmpTsConfigPath, generatedTSConfig);
    return tmpTsConfigPath;
}
function cleanupTmpTsConfigFile(tmpTsConfigPath) {
    try {
        if (tmpTsConfigPath) {
            fs.unlinkSync(tmpTsConfigPath);
        }
    }
    catch (e) { }
}
//# sourceMappingURL=workspace-schematic.js.map