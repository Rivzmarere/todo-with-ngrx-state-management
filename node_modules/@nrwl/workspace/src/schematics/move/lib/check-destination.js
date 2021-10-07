"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDestination = void 0;
const workspace_1 = require("@nrwl/workspace");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const utils_1 = require("./utils");
/**
 * Checks whether the destination folder is valid
 *
 * - must not be outside the workspace
 * - must be a new folder
 *
 * @param schema The options provided to the schematic
 */
function checkDestination(schema) {
    return (tree, _context) => {
        return rxjs_1.from(workspace_1.getWorkspace(tree)).pipe(operators_1.map((workspace) => {
            const INVALID_DESTINATION = `Invalid destination: [${schema.destination}]`;
            if (schema.destination.includes('..')) {
                throw new Error(`${INVALID_DESTINATION} - Please specify explicit path.`);
            }
            const destination = utils_1.getDestination(schema, workspace, tree);
            if (tree.getDir(destination).subfiles.length > 0) {
                throw new Error(`${INVALID_DESTINATION} - Path is not empty.`);
            }
            if (schema.destination.startsWith('/')) {
                schema.destination = utils_1.normalizeSlashes(schema.destination.substr(1));
            }
            return tree;
        }));
    };
}
exports.checkDestination = checkDestination;
//# sourceMappingURL=check-destination.js.map