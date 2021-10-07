"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogger = void 0;
const core_1 = require("@angular-devkit/core");
const node_1 = require("@angular-devkit/core/node");
const NX_PREFIX = `${core_1.terminal.cyan('>')} ${core_1.terminal.inverse(core_1.terminal.bold(core_1.terminal.cyan(' NX ')))}`;
const NX_ERROR = core_1.terminal.inverse(core_1.terminal.bold(core_1.terminal.red(' ERROR ')));
let logger;
exports.getLogger = (isVerbose = false) => {
    if (!logger) {
        logger = node_1.createConsoleLogger(isVerbose, process.stdout, process.stderr, {
            warn: (s) => core_1.terminal.bold(core_1.terminal.yellow(s)),
            error: (s) => {
                if (s.startsWith('NX ')) {
                    return `\n${NX_ERROR} ${core_1.terminal.bold(core_1.terminal.red(s.substr(3)))}\n`;
                }
                return core_1.terminal.bold(core_1.terminal.red(s));
            },
            fatal: (s) => core_1.terminal.bold(core_1.terminal.red(s)),
            info: (s) => {
                if (s.startsWith('NX ')) {
                    return `\n${NX_PREFIX} ${core_1.terminal.bold(s.substr(3))}\n`;
                }
                return core_1.terminal.white(s);
            },
        });
    }
    return logger;
};
//# sourceMappingURL=logger.js.map