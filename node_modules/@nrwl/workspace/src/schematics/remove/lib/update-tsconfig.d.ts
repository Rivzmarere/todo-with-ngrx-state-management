import { SchematicContext, Tree } from '@angular-devkit/schematics';
import { Observable } from 'rxjs';
import { Schema } from '../schema';
/**
 * Updates the tsconfig paths to remove the project.
 *
 * @param schema The options provided to the schematic
 */
export declare function updateTsconfig(schema: Schema): (tree: Tree, _context: SchematicContext) => Observable<Tree>;
