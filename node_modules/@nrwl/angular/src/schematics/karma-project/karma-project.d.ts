import { Rule } from '@angular-devkit/schematics';
export interface KarmaProjectSchema {
    project: string;
}
export default function (options: KarmaProjectSchema): Rule;
