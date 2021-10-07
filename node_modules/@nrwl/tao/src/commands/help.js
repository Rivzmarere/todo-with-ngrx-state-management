"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.help = void 0;
const core_1 = require("@angular-devkit/core");
const logger_1 = require("../shared/logger");
const print_help_1 = require("../shared/print-help");
function help() {
    const logger = logger_1.getLogger(true);
    logger.info(core_1.tags.stripIndent `
    ${core_1.terminal.bold(print_help_1.toolDescription)}
  
    ${core_1.terminal.bold('Create a new project.')}
    ${print_help_1.commandName} new ${core_1.terminal.grey('[project-name] [--collection=schematic-collection] [options, ...]')}
    
    ${core_1.terminal.bold('Generate code.')}
    ${print_help_1.commandName} generate ${core_1.terminal.grey('[schematic-collection:][schematic] [options, ...]')}
    ${print_help_1.commandName} g ${core_1.terminal.grey('[schematic-collection:][schematic] [options, ...]')}

    ${core_1.terminal.bold('Run target.')}    
    ${print_help_1.commandName} run ${core_1.terminal.grey('[project][:target][:configuration] [options, ...]')}
    ${print_help_1.commandName} r ${core_1.terminal.grey('[project][:target][:configuration] [options, ...]')}
    
    You can also use the infix notation to run a target:
    ${print_help_1.commandName} [target] [project] [options, ...]

    ${core_1.terminal.bold('Migrate packages and create migrations.json.')}
    ${print_help_1.commandName} migrate ${core_1.terminal.grey('[package-name]')}
    
    ${core_1.terminal.bold('Run migrations.')}
    ${print_help_1.commandName} migrate ${core_1.terminal.grey('--run-migrations=[filename]')}

  `);
    return 0;
}
exports.help = help;
//# sourceMappingURL=help.js.map