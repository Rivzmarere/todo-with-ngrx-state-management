import { BuilderContext, BuilderOutput } from '@angular-devkit/architect';
import { Observable } from 'rxjs';
import { JsonObject } from '@angular-devkit/core';
export interface CypressBuilderOptions extends JsonObject {
    baseUrl: string;
    cypressConfig: string;
    devServerTarget: string;
    headless: boolean;
    exit: boolean;
    parallel: boolean;
    record: boolean;
    key?: string;
    tsConfig: string;
    watch: boolean;
    browser?: string;
    env?: Record<string, string>;
    spec?: string;
    copyFiles?: string;
    ciBuildId?: string;
    group?: string;
    ignoreTestFiles?: string;
    reporter?: string;
    reporterOptions?: string;
}
declare const _default: import("@angular-devkit/architect/src/internal").Builder<CypressBuilderOptions>;
export default _default;
/**
 * @whatItDoes This is the starting point of the builder.
 * @param options
 * @param context
 */
export declare function cypressBuilderRunner(options: CypressBuilderOptions, context: BuilderContext): Observable<BuilderOutput>;
/**
 * @whatItDoes Compile the application using the webpack builder.
 * @param devServerTarget
 * @param isWatching
 * @param context
 * @private
 */
export declare function startDevServer(devServerTarget: string, isWatching: boolean, context: BuilderContext): Observable<string>;
