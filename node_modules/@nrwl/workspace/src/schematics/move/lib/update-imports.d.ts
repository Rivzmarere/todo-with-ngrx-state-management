import { SchematicContext, Tree } from '@angular-devkit/schematics';
import { Observable } from 'rxjs';
import { Schema } from '../schema';
/**
 * Updates all the imports in the workspace and modifies the tsconfig appropriately.
 *
 * @param schema The options provided to the schematic
 */
export declare function updateImports(schema: Schema): (tree: Tree, _context: SchematicContext) => Observable<Tree>;
