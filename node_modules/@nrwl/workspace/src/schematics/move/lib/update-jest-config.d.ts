import { Rule } from '@angular-devkit/schematics';
import { Schema } from '../schema';
/**
 * Updates the project name and coverage folder in the jest.config.js if it exists
 *
 * (assume relative paths have been updated previously)
 *
 * @param schema The options provided to the schematic
 */
export declare function updateJestConfig(schema: Schema): Rule;
