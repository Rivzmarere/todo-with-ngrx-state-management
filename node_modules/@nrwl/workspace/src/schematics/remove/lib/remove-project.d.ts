import { SchematicContext, Tree } from '@angular-devkit/schematics';
import { Observable } from 'rxjs';
import { Schema } from '../schema';
/**
 * Removes (deletes) a project from the folder tree
 *
 * @param schema The options provided to the schematic
 */
export declare function removeProject(schema: Schema): (tree: Tree, _context: SchematicContext) => Observable<Tree>;
