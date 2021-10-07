"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lookupUnmatched = exports.convertAliases = exports.coerceTypes = exports.convertToCamelCase = exports.handleErrors = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
function handleErrors(logger, isVerbose, fn) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            return yield fn();
        }
        catch (err) {
            if (err instanceof schematics_1.UnsuccessfulWorkflowExecution) {
                logger.fatal('The Schematic workflow failed. See above.');
            }
            else {
                logger.fatal(err.message);
            }
            if (isVerbose && err.stack) {
                logger.info(err.stack);
            }
            return 1;
        }
    });
}
exports.handleErrors = handleErrors;
function camelCase(input) {
    if (input.indexOf('-') > 1) {
        return input
            .toLowerCase()
            .replace(/-(.)/g, (match, group1) => group1.toUpperCase());
    }
    else {
        return input;
    }
}
function convertToCamelCase(parsed) {
    return Object.keys(parsed).reduce((m, c) => (Object.assign(Object.assign({}, m), { [camelCase(c)]: parsed[c] })), {});
}
exports.convertToCamelCase = convertToCamelCase;
/**
 * Coerces (and replaces) options identified as 'boolean' or 'number' in the Schema
 *
 * @param opts The options to check
 * @param schema The schema definition with types to check against
 *
 */
function coerceTypes(opts, schema) {
    Object.keys(opts).forEach((k) => {
        if (schema.properties[k] && schema.properties[k].type == 'boolean') {
            opts[k] = opts[k] === true || opts[k] === 'true';
        }
        else if (schema.properties[k] && schema.properties[k].type == 'number') {
            opts[k] = Number(opts[k]);
        }
        else if (schema.properties[k] && schema.properties[k].type == 'array') {
            opts[k] = opts[k].toString().split(',');
        }
    });
    return opts;
}
exports.coerceTypes = coerceTypes;
/**
 * Converts any options passed in with short aliases to their full names if found
 * Unmatched options are added to opts['--']
 *
 * @param opts The options passed in by the user
 * @param schema The schema definition to check against
 */
function convertAliases(opts, schema, excludeUnmatched) {
    return Object.keys(opts).reduce((acc, k) => {
        if (schema.properties[k]) {
            acc[k] = opts[k];
        }
        else {
            const found = Object.entries(schema.properties).find(([_, d]) => d.alias === k);
            if (found) {
                acc[found[0]] = opts[k];
            }
            else if (excludeUnmatched) {
                if (!acc['--']) {
                    acc['--'] = [];
                }
                acc['--'].push({
                    name: k,
                    possible: [],
                });
            }
            else {
                acc[k] = opts[k];
            }
        }
        return acc;
    }, {});
}
exports.convertAliases = convertAliases;
/**
 * Tries to find what the user meant by unmatched commands
 *
 * @param opts The options passed in by the user
 * @param schema The schema definition to check against
 *
 */
function lookupUnmatched(opts, schema) {
    if (opts['--']) {
        const props = Object.keys(schema.properties);
        opts['--'].forEach((unmatched) => {
            unmatched.possible = props.filter((p) => core_1.strings.levenshtein(p, unmatched.name) < 3);
        });
    }
    return opts;
}
exports.lookupUnmatched = lookupUnmatched;
//# sourceMappingURL=params.js.map