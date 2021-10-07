"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unparse = exports.getOutputsForTargetAndConfiguration = exports.getOutputs = exports.getCommand = exports.getCommandAsString = void 0;
const flatten = require("flat");
const commonCommands = ['build', 'test', 'lint', 'e2e', 'deploy'];
function getCommandAsString(cliCommand, isYarn, task) {
    return getCommand(cliCommand, isYarn, task).join(' ').trim();
}
exports.getCommandAsString = getCommandAsString;
function getCommand(cliCommand, isYarn, task) {
    const args = Object.entries(task.overrides || {}).map(([prop, value]) => `--${prop}=${value}`);
    if (commonCommands.includes(task.target.target)) {
        const config = task.target.configuration
            ? [`--configuration`, task.target.configuration]
            : [];
        return [
            cliCommand,
            ...(isYarn ? [] : ['--']),
            task.target.target,
            task.target.project,
            ...config,
            ...args,
        ];
    }
    else {
        const config = task.target.configuration
            ? `:${task.target.configuration} `
            : '';
        return [
            cliCommand,
            ...(isYarn ? [] : ['--']),
            'run',
            `${task.target.project}:${task.target.target}${config}`,
            ...args,
        ];
    }
}
exports.getCommand = getCommand;
function getOutputs(p, task) {
    return getOutputsForTargetAndConfiguration(task, p[task.target.project]);
}
exports.getOutputs = getOutputs;
function getOutputsForTargetAndConfiguration(task, node) {
    var _a, _b;
    if ((_a = task.overrides) === null || _a === void 0 ? void 0 : _a.outputPath) {
        return [(_b = task.overrides) === null || _b === void 0 ? void 0 : _b.outputPath];
    }
    const { target, configuration } = task.target;
    const architect = node.data.architect[target];
    if (architect && architect.outputs)
        return architect.outputs;
    let opts = architect.options || {};
    if (architect.configurations && architect.configurations[configuration]) {
        opts = Object.assign(Object.assign({}, opts), architect.configurations[configuration]);
    }
    if (opts.outputPath) {
        return Array.isArray(opts.outputPath) ? opts.outputPath : [opts.outputPath];
    }
    else if (target === 'build') {
        return [`dist/${node.data.root}`];
    }
    else {
        return [];
    }
}
exports.getOutputsForTargetAndConfiguration = getOutputsForTargetAndConfiguration;
function unparse(options) {
    const unparsed = [];
    for (const key of Object.keys(options)) {
        const value = options[key];
        unparseOption(key, value, unparsed);
    }
    return unparsed;
}
exports.unparse = unparse;
function unparseOption(key, value, unparsed) {
    if (value === true) {
        unparsed.push(`--${key}`);
    }
    else if (value === false) {
        unparsed.push(`--no-${key}`);
    }
    else if (Array.isArray(value)) {
        value.forEach((item) => unparseOption(key, item, unparsed));
    }
    else if (Object.prototype.toString.call(value) === '[object Object]') {
        const flattened = flatten(value, { safe: true });
        for (const flattenedKey in flattened) {
            unparseOption(`${key}.${flattenedKey}`, flattened[flattenedKey], unparsed);
        }
    }
    else if (typeof value === 'string' || value != null) {
        unparsed.push(`--${key}=${value}`);
    }
}
//# sourceMappingURL=utils.js.map