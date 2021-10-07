import { WorkspaceDefinition } from '@angular-devkit/core/src/workspace';
import { Tree } from '@angular-devkit/schematics';
import { Schema } from '../schema';
/**
 * This helper function retrieves the users workspace layout from
 * `nx.json`. If the user does not have this property defined then
 * we assume the default `apps/` and `libs/` layout.
 *
 * @param host The host tree
 */
export declare function getWorkspaceLayout(host: Tree): {
    appsDir?: string;
    libsDir?: string;
};
/**
 * This helper function ensures that we don't move libs or apps
 * outside of the folders they should be in.
 *
 * This will break if someone isn't using the default libs/apps
 * folders. In that case, they're on their own :/
 *
 * @param schema
 * @param workspace
 */
export declare function getDestination(schema: Schema, workspace: WorkspaceDefinition | any, host: Tree): string;
/**
 * Replaces slashes with dashes
 *
 * @param path
 */
export declare function getNewProjectName(path: string): string;
/**
 * Normalizes slashes (removes duplicates)
 *
 * @param input
 */
export declare function normalizeSlashes(input: string): string;
