import { Tree } from '@angular-devkit/schematics';
import { Architect, BuilderContext, Target } from '@angular-devkit/architect';
import { TestingArchitectHost, TestLogger } from '@angular-devkit/architect/testing';
import { json, JsonObject } from '@angular-devkit/core';
import { ScheduleOptions } from '@angular-devkit/architect/src/api';
export declare function getFileContent(tree: Tree, path: string): string;
export declare function createEmptyWorkspace(tree: Tree): Tree;
/**
 * Mock context which makes testing builders easier
 */
export declare class MockBuilderContext implements BuilderContext {
    private architect;
    private architectHost;
    id: 0;
    builder: any;
    analytics: any;
    target: Target;
    logger: TestLogger;
    get currentDirectory(): string;
    get workspaceRoot(): string;
    constructor(architect: Architect, architectHost: TestingArchitectHost);
    addBuilderFromPackage(path: string): Promise<void>;
    addTarget(target: Target, builderName: string): Promise<void>;
    getBuilderNameForTarget(target: Target): Promise<string>;
    scheduleTarget(target: Target, overrides?: JsonObject, scheduleOptions?: ScheduleOptions): Promise<import("@angular-devkit/architect").BuilderRun>;
    scheduleBuilder(name: string, overrides?: JsonObject, scheduleOptions?: ScheduleOptions): Promise<import("@angular-devkit/architect").BuilderRun>;
    getTargetOptions(target: Target): Promise<json.JsonObject>;
    validateOptions<T extends JsonObject = JsonObject>(options: JsonObject, builderName: string): Promise<T>;
    reportRunning(): void;
    reportStatus(status: string): void;
    reportProgress(current: number, total?: number, status?: string): void;
    addTeardown(teardown: () => Promise<void> | void): void;
    getProjectMetadata(target: Target | string): Promise<json.JsonObject | null>;
}
