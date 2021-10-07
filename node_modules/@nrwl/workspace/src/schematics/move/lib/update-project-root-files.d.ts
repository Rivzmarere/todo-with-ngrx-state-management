import { Rule } from '@angular-devkit/schematics';
import { Schema } from '../schema';
/**
 * Updates the files in the root of the project
 *
 * Typically these are config files which point outside of the project folder
 *
 * @param schema The options provided to the schematic
 */
export declare function updateProjectRootFiles(schema: Schema): Rule;
