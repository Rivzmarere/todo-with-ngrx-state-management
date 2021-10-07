"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removePropertyFromJestConfig = exports.addPropertyToJestConfig = void 0;
const workspace_1 = require("@nrwl/workspace");
const functions_1 = require("./functions");
/**
 * Add a property to the jest config
 * @param host
 * @param path - path to the jest config file
 * @param propertyName - Property to update. Can be dot delimited to access deeply nested properties
 * @param value
 */
function addPropertyToJestConfig(host, path, propertyName, value) {
    const configObject = functions_1.jestConfigObjectAst(host, path);
    const properties = propertyName.split('.');
    const changes = functions_1.addOrUpdateProperty(configObject, properties, JSON.stringify(value), path);
    workspace_1.insert(host, path, changes);
}
exports.addPropertyToJestConfig = addPropertyToJestConfig;
/**
 * Remove a property value from the jest config
 * @param host
 * @param path
 * @param propertyName - Property to remove. Can be dot delimited to access deeply nested properties
 */
function removePropertyFromJestConfig(host, path, propertyName) {
    const configObject = functions_1.jestConfigObjectAst(host, path);
    const propertyAssignment = functions_1.removeProperty(configObject, propertyName.split('.'));
    if (propertyAssignment) {
        const file = host.read(path).toString('utf-8');
        const commaNeeded = file[propertyAssignment.end] === ',';
        workspace_1.insert(host, path, [
            new workspace_1.RemoveChange(path, propertyAssignment.getStart(), `${propertyAssignment.getText()}${commaNeeded ? ',' : ''}`),
        ]);
    }
}
exports.removePropertyFromJestConfig = removePropertyFromJestConfig;
//# sourceMappingURL=update-config.js.map