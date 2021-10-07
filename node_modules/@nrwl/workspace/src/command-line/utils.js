"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAffectedConfig = exports.splitArgsIntoNxArgsAndOverrides = void 0;
const yargsParser = require("yargs-parser");
const fileUtils = require("../core/file-utils");
const output_1 = require("../utils/output");
const runOne = [
    'target',
    'configuration',
    'prod',
    'runner',
    'parallel',
    'maxParallel',
    'max-parallel',
    'exclude',
    'onlyFailed',
    'only-failed',
    'verbose',
    'help',
    'version',
    'withDeps',
    'with-deps',
    'skipNxCache',
    'skip-nx-cache',
    'scan',
];
const runMany = [...runOne, 'projects', 'quiet', 'all'];
const runAffected = [
    ...runOne,
    'untracked',
    'uncommitted',
    'all',
    'base',
    'head',
    'files',
    'quiet',
    'plain',
    'select',
];
const ignoreArgs = ['$0', '_'];
function splitArgsIntoNxArgsAndOverrides(args, mode, options = { printWarnings: true }) {
    const nxSpecific = mode === 'run-one' ? runOne : mode === 'run-many' ? runMany : runAffected;
    const nxArgs = {};
    const overrides = yargsParser(args._);
    delete overrides._;
    Object.entries(args).forEach(([key, value]) => {
        if (nxSpecific.includes(key)) {
            nxArgs[key] = value;
        }
        else if (!ignoreArgs.includes(key)) {
            overrides[key] = value;
        }
    });
    if (mode === 'run-many') {
        if (!nxArgs.projects) {
            nxArgs.projects = [];
        }
        else {
            nxArgs.projects = args.projects
                .split(',')
                .map((p) => p.trim());
        }
    }
    if (nxArgs.prod) {
        delete nxArgs.prod;
        nxArgs.configuration = 'production';
    }
    if (mode === 'affected') {
        if (options.printWarnings) {
            printArgsWarning(nxArgs);
        }
        if (!nxArgs.files &&
            !nxArgs.uncommitted &&
            !nxArgs.untracked &&
            !nxArgs.base &&
            !nxArgs.head &&
            !nxArgs.all &&
            args._.length >= 2) {
            nxArgs.base = args._[0];
            nxArgs.head = args._[1];
        }
        else if (!nxArgs.base) {
            const affectedConfig = getAffectedConfig();
            nxArgs.base = affectedConfig.defaultBase;
        }
    }
    if (!nxArgs.skipNxCache) {
        nxArgs.skipNxCache = false;
    }
    return { nxArgs, overrides };
}
exports.splitArgsIntoNxArgsAndOverrides = splitArgsIntoNxArgsAndOverrides;
function getAffectedConfig() {
    const config = fileUtils.readNxJson();
    const defaultBase = 'master';
    if (config.affected) {
        return {
            defaultBase: config.affected.defaultBase || defaultBase,
        };
    }
    else {
        return {
            defaultBase,
        };
    }
}
exports.getAffectedConfig = getAffectedConfig;
function printArgsWarning(options) {
    const { files, uncommitted, untracked, base, head, all } = options;
    const affectedConfig = getAffectedConfig();
    if (!files && !uncommitted && !untracked && !base && !head && !all) {
        output_1.output.note({
            title: `Affected criteria defaulted to --base=${output_1.output.bold(`${affectedConfig.defaultBase}`)} --head=${output_1.output.bold('HEAD')}`,
        });
    }
    if (all) {
        output_1.output.warn({
            title: `Running affected:* commands with --all can result in very slow builds.`,
            bodyLines: [
                output_1.output.bold('--all') +
                    ' is not meant to be used for any sizable project or to be used in CI.',
                '',
                output_1.output.colors.gray('Learn more about checking only what is affected: ') + 'https://nx.dev/guides/monorepo-affected.',
            ],
        });
    }
}
//# sourceMappingURL=utils.js.map