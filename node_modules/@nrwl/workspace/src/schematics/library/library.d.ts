import { Rule } from '@angular-devkit/schematics';
import { Schema } from './schema';
export interface NormalizedSchema extends Schema {
    name: string;
    fileName: string;
    projectRoot: string;
    projectDirectory: string;
    parsedTags: string[];
    importPath?: string;
}
export default function (schema: Schema): Rule;
