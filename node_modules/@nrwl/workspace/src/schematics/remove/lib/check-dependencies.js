"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDependencies = void 0;
const ast_utils_1 = require("@nrwl/workspace/src/utils/ast-utils");
const cli_config_utils_1 = require("@nrwl/workspace/src/utils/cli-config-utils");
const ignore_1 = require("ignore");
const path = require("path");
const project_graph_1 = require("../../../core/project-graph");
/**
 * Check whether the project to be removed is depended on by another project
 *
 * Throws an error if the project is in use, unless the `--forceRemove` option is used.
 *
 * @param schema The options provided to the schematic
 */
function checkDependencies(schema) {
    if (schema.forceRemove) {
        return (tree) => tree;
    }
    let ig = ignore_1.default();
    return (tree) => {
        if (tree.exists('.gitignore')) {
            ig = ig.add(tree.read('.gitignore').toString());
        }
        const files = [];
        const workspaceDir = path.dirname(cli_config_utils_1.getWorkspacePath(tree));
        for (const dir of tree.getDir('/').subdirs) {
            if (ig.ignores(dir)) {
                continue;
            }
            tree.getDir(dir).visit((file) => {
                files.push({
                    file: path.relative(workspaceDir, file),
                    ext: path.extname(file),
                    hash: '',
                });
            });
        }
        const graph = project_graph_1.createProjectGraph(ast_utils_1.readWorkspace(tree), ast_utils_1.readNxJsonInTree(tree), files, (file) => {
            try {
                return tree.read(file).toString('utf-8');
            }
            catch (e) {
                throw new Error(`Could not read ${file}`);
            }
        }, false, false);
        const reverseGraph = project_graph_1.onlyWorkspaceProjects(project_graph_1.reverse(graph));
        const deps = reverseGraph.dependencies[schema.projectName] || [];
        if (deps.length === 0) {
            return tree;
        }
        throw new Error(`${schema.projectName} is still depended on by the following projects:\n${deps
            .map((x) => x.target)
            .join('\n')}`);
    };
}
exports.checkDependencies = checkDependencies;
//# sourceMappingURL=check-dependencies.js.map