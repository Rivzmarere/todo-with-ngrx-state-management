import { Rule } from '@angular-devkit/schematics';
import { Schema } from '../schema';
/**
 * Updates the videos and screenshots folders in the cypress.json if it exists (i.e. we're moving an e2e project)
 *
 * (assume relative paths have been updated previously)
 *
 * @param schema The options provided to the schematic
 */
export declare function updateCypressJson(schema: Schema): Rule;
