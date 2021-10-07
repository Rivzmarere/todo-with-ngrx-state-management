import { logging } from '@angular-devkit/core';
import { ParsedArgs } from 'minimist';
export declare type Schema = {
    properties: {
        [p: string]: {
            type: string;
            alias?: string;
            description?: string;
            default?: string | number | boolean | string[];
        };
    };
    required?: string[];
    description?: string;
};
export declare type Unmatched = {
    name: string;
    possible: string[];
};
export declare type Options = {
    '--'?: Unmatched[];
    [k: string]: string | number | boolean | string[] | Unmatched[];
};
export declare function handleErrors(logger: logging.Logger, isVerbose: boolean, fn: Function): Promise<any>;
export declare function convertToCamelCase(parsed: ParsedArgs): Options;
/**
 * Coerces (and replaces) options identified as 'boolean' or 'number' in the Schema
 *
 * @param opts The options to check
 * @param schema The schema definition with types to check against
 *
 */
export declare function coerceTypes(opts: Options, schema: Schema): Options;
/**
 * Converts any options passed in with short aliases to their full names if found
 * Unmatched options are added to opts['--']
 *
 * @param opts The options passed in by the user
 * @param schema The schema definition to check against
 */
export declare function convertAliases(opts: Options, schema: Schema, excludeUnmatched: boolean): Options;
/**
 * Tries to find what the user meant by unmatched commands
 *
 * @param opts The options passed in by the user
 * @param schema The schema definition to check against
 *
 */
export declare function lookupUnmatched(opts: Options, schema: Schema): Options;
