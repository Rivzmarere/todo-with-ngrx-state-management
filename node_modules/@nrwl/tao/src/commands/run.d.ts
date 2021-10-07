import { WorkspaceDefinition } from '@angular-devkit/core/src/workspace';
import { Options } from '../shared/params';
export interface RunOptions {
    project: string;
    target: string;
    configuration: string;
    help: boolean;
    runOptions: Options;
}
export declare function validateTargetAndConfiguration(workspace: WorkspaceDefinition, opts: RunOptions): void;
export declare function run(root: string, args: string[], isVerbose: boolean): Promise<any>;
