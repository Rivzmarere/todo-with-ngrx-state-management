"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const check_project_exists_1 = require("../../utils/rules/check-project-exists");
const format_files_1 = require("../../utils/rules/format-files");
const check_dependencies_1 = require("./lib/check-dependencies");
const check_targets_1 = require("./lib/check-targets");
const remove_project_1 = require("./lib/remove-project");
const update_nx_json_1 = require("./lib/update-nx-json");
const update_tsconfig_1 = require("./lib/update-tsconfig");
const update_workspace_1 = require("./lib/update-workspace");
function default_1(schema) {
    return schematics_1.chain([
        check_project_exists_1.checkProjectExists(schema),
        check_dependencies_1.checkDependencies(schema),
        check_targets_1.checkTargets(schema),
        remove_project_1.removeProject(schema),
        update_nx_json_1.updateNxJson(schema),
        update_tsconfig_1.updateTsconfig(schema),
        update_workspace_1.updateWorkspace(schema),
        format_files_1.formatFiles(schema),
    ]);
}
exports.default = default_1;
//# sourceMappingURL=remove.js.map