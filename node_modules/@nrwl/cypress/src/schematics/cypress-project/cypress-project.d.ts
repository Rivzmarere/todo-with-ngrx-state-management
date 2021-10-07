import { Rule } from '@angular-devkit/schematics';
import { Schema } from './schema';
export interface CypressProjectSchema extends Schema {
    projectName: string;
    projectRoot: string;
}
export default function (options: CypressProjectSchema): Rule;
