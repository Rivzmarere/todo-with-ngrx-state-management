import { SchematicContext, Tree } from '@angular-devkit/schematics';
import { Schema } from '../schema';
/**
 * Updates the project in the workspace file
 *
 * - update all references to the old root path
 * - change the project name
 * - change target references
 *
 * @param schema The options provided to the schematic
 */
export declare function updateWorkspace(schema: Schema): (tree: Tree, _context: SchematicContext) => import("@angular-devkit/schematics").Rule;
