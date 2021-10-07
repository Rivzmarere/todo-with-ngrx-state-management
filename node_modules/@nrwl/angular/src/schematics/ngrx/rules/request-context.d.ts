import { Tree } from '@angular-devkit/schematics';
import { Schema } from '../schema';
/**
 * Schematic request context
 */
export interface RequestContext {
    featureName: string;
    moduleDir: string;
    options?: Schema;
    host?: Tree;
}
export declare function buildNameToNgrxFile(context: RequestContext, suffice: string): string;
