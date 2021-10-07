"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const check_project_exists_1 = require("../../utils/rules/check-project-exists");
const check_destination_1 = require("./lib/check-destination");
const move_project_1 = require("./lib/move-project");
const update_cypress_json_1 = require("./lib/update-cypress-json");
const update_imports_1 = require("./lib/update-imports");
const update_jest_config_1 = require("./lib/update-jest-config");
const update_nx_json_1 = require("./lib/update-nx-json");
const update_project_root_files_1 = require("./lib/update-project-root-files");
const update_workspace_1 = require("./lib/update-workspace");
function default_1(schema) {
    return schematics_1.chain([
        check_project_exists_1.checkProjectExists(schema),
        check_destination_1.checkDestination(schema),
        move_project_1.moveProject(schema),
        update_project_root_files_1.updateProjectRootFiles(schema),
        update_cypress_json_1.updateCypressJson(schema),
        update_jest_config_1.updateJestConfig(schema),
        update_nx_json_1.updateNxJson(schema),
        update_imports_1.updateImports(schema),
        update_workspace_1.updateWorkspace(schema),
    ]);
}
exports.default = default_1;
//# sourceMappingURL=move.js.map