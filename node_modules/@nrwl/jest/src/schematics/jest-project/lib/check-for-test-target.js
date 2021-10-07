"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkForTestTarget = void 0;
const schematics_1 = require("@angular-devkit/schematics");
const workspace_1 = require("@nrwl/workspace");
function checkForTestTarget(options) {
    return (tree) => {
        const projectConfig = workspace_1.getProjectConfig(tree, options.project);
        if (projectConfig.architect.test) {
            throw new schematics_1.SchematicsException(`${options.project}: already has a test architect option.`);
        }
        return tree;
    };
}
exports.checkForTestTarget = checkForTestTarget;
//# sourceMappingURL=check-for-test-target.js.map