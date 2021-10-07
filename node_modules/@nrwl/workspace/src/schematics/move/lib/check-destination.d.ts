import { Rule } from '@angular-devkit/schematics';
import { Schema } from '../schema';
/**
 * Checks whether the destination folder is valid
 *
 * - must not be outside the workspace
 * - must be a new folder
 *
 * @param schema The options provided to the schematic
 */
export declare function checkDestination(schema: Schema): Rule;
