"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const workspace_1 = require("@nrwl/workspace");
const workspace_2 = require("@nrwl/workspace");
function default_1(schema) {
    const options = normalizeOptions(schema);
    const templateSource = schematics_1.apply(schematics_1.url('./files'), [
        schematics_1.template(Object.assign({ dot: '.', tmpl: '' }, options)),
        schematics_1.move('tools/schematics'),
    ]);
    return schematics_1.chain([
        schematics_1.branchAndMerge(schematics_1.chain([schematics_1.mergeWith(templateSource)])),
        workspace_1.formatFiles(options),
    ]);
}
exports.default = default_1;
function normalizeOptions(options) {
    const name = workspace_2.toFileName(options.name);
    return Object.assign(Object.assign({}, options), { name });
}
//# sourceMappingURL=workspace-schematic.js.map