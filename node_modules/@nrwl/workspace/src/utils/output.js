"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.output = void 0;
const chalk_1 = require("chalk");
/**
 * Automatically disable styling applied by chalk if CI=true
 */
if (process.env.CI === 'true') {
    chalk_1.default.level = 0;
}
class CLIOutput {
    constructor() {
        this.NX_PREFIX = `${chalk_1.default.cyan('>')} ${chalk_1.default.reset.inverse.bold.cyan(' NX ')}`;
        /**
         * Longer dash character which forms more of a continuous line when place side to side
         * with itself, unlike the standard dash character
         */
        this.VERTICAL_SEPARATOR = '———————————————————————————————————————————————';
        /**
         * Expose some color and other utility functions so that other parts of the codebase that need
         * more fine-grained control of message bodies are still using a centralized
         * implementation.
         */
        this.colors = {
            gray: chalk_1.default.gray,
        };
        this.bold = chalk_1.default.bold;
        this.underline = chalk_1.default.underline;
    }
    writeToStdOut(str) {
        process.stdout.write(str);
    }
    writeOutputTitle({ label, title, }) {
        let outputTitle;
        if (label) {
            outputTitle = `${this.NX_PREFIX} ${label} ${title}\n`;
        }
        else {
            outputTitle = `${this.NX_PREFIX} ${title}\n`;
        }
        this.writeToStdOut(outputTitle);
    }
    writeOptionalOutputBody(bodyLines) {
        if (!bodyLines) {
            return;
        }
        this.addNewline();
        bodyLines.forEach((bodyLine) => this.writeToStdOut('  ' + bodyLine + '\n'));
    }
    addNewline() {
        this.writeToStdOut('\n');
    }
    addVerticalSeparator() {
        this.writeToStdOut(`\n${chalk_1.default.gray(this.VERTICAL_SEPARATOR)}\n\n`);
    }
    addVerticalSeparatorWithoutNewLines() {
        this.writeToStdOut(`${chalk_1.default.gray(this.VERTICAL_SEPARATOR)}\n`);
    }
    error({ title, slug, bodyLines }) {
        this.addNewline();
        this.writeOutputTitle({
            label: chalk_1.default.reset.inverse.bold.red(' ERROR '),
            title: chalk_1.default.bold.red(title),
        });
        this.writeOptionalOutputBody(bodyLines);
        /**
         * Optional slug to be used in an Nx error message redirect URL
         */
        if (slug && typeof slug === 'string') {
            this.addNewline();
            this.writeToStdOut(chalk_1.default.grey('  ' + 'Learn more about this error: ') +
                'https://errors.nx.dev/' +
                slug +
                '\n');
        }
        this.addNewline();
    }
    warn({ title, slug, bodyLines }) {
        this.addNewline();
        this.writeOutputTitle({
            label: chalk_1.default.reset.inverse.bold.yellow(' WARNING '),
            title: chalk_1.default.bold.yellow(title),
        });
        this.writeOptionalOutputBody(bodyLines);
        /**
         * Optional slug to be used in an Nx warning message redirect URL
         */
        if (slug && typeof slug === 'string') {
            this.addNewline();
            this.writeToStdOut(chalk_1.default.grey('  ' + 'Learn more about this warning: ') +
                'https://errors.nx.dev/' +
                slug +
                '\n');
        }
        this.addNewline();
    }
    note({ title, bodyLines }) {
        this.addNewline();
        this.writeOutputTitle({
            label: chalk_1.default.reset.inverse.bold.keyword('orange')(' NOTE '),
            title: chalk_1.default.bold.keyword('orange')(title),
        });
        this.writeOptionalOutputBody(bodyLines);
        this.addNewline();
    }
    success({ title, bodyLines }) {
        this.addNewline();
        this.writeOutputTitle({
            label: chalk_1.default.reset.inverse.bold.green(' SUCCESS '),
            title: chalk_1.default.bold.green(title),
        });
        this.writeOptionalOutputBody(bodyLines);
        this.addNewline();
    }
    logSingleLine(message) {
        this.addNewline();
        this.writeOutputTitle({
            title: message,
        });
        this.addNewline();
    }
    logCommand(message) {
        this.addNewline();
        this.writeToStdOut(chalk_1.default.bold(`> ${message} `));
        this.addNewline();
    }
    log({ title, bodyLines }) {
        this.addNewline();
        this.writeOutputTitle({
            title: chalk_1.default.white(title),
        });
        this.writeOptionalOutputBody(bodyLines);
        this.addNewline();
    }
}
exports.output = new CLIOutput();
//# sourceMappingURL=output.js.map