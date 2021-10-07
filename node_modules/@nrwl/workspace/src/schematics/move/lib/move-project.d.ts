import { SchematicContext, Tree } from '@angular-devkit/schematics';
import { Observable } from 'rxjs';
import { Schema } from '../schema';
/**
 * Moves a project to the given destination path
 *
 * @param schema The options provided to the schematic
 */
export declare function moveProject(schema: Schema): (tree: Tree, _context: SchematicContext) => Observable<Tree>;
