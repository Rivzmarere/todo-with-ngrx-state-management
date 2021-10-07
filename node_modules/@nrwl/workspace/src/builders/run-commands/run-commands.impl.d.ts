import { JsonObject } from '@angular-devkit/core';
export declare const LARGE_BUFFER: number;
export interface RunCommandsBuilderOptions extends JsonObject {
    command: string;
    commands: ({
        command: string;
        forwardAllArgs?: boolean;
    } | string)[];
    color?: boolean;
    parallel?: boolean;
    readyWhen?: string;
    cwd?: string;
    args?: string;
    envFile?: string;
    outputPath?: string;
}
export interface NormalizedRunCommandsBuilderOptions extends RunCommandsBuilderOptions {
    commands: {
        command: string;
        forwardAllArgs?: boolean;
    }[];
    parsedArgs: {
        [k: string]: any;
    };
}
declare const _default: import("@angular-devkit/architect/src/internal").Builder<RunCommandsBuilderOptions>;
export default _default;
