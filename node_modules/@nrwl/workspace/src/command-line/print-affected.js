"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectPrintAffected = exports.printAffected = void 0;
const run_command_1 = require("../tasks-runner/run-command");
const path_1 = require("path");
const utils_1 = require("../tasks-runner/utils");
const file_utils_1 = require("../core/file-utils");
function printAffected(affectedProjectsWithTargetAndConfig, affectedProjects, projectGraph, nxArgs, overrides) {
    const projectNames = affectedProjects.map((p) => p.name);
    const tasksJson = createTasks(affectedProjectsWithTargetAndConfig, projectGraph, nxArgs, overrides);
    const result = {
        tasks: tasksJson,
        projects: projectNames,
        projectGraph: serializeProjectGraph(projectGraph),
    };
    if (nxArgs.select) {
        console.log(selectPrintAffected(result, nxArgs.select));
    }
    else {
        console.log(JSON.stringify(selectPrintAffected(result, null), null, 2));
    }
}
exports.printAffected = printAffected;
function createTasks(affectedProjectsWithTargetAndConfig, projectGraph, nxArgs, overrides) {
    const tasks = affectedProjectsWithTargetAndConfig.map((affectedProject) => run_command_1.createTask({
        project: affectedProject,
        target: nxArgs.target,
        configuration: nxArgs.configuration,
        overrides: overrides,
    }));
    const cli = file_utils_1.cliCommand();
    const isYarn = path_1.basename(process.env.npm_execpath || 'npm').startsWith('yarn');
    return tasks.map((task) => ({
        id: task.id,
        overrides: overrides,
        target: task.target,
        command: `${isYarn ? 'yarn' : 'npm run'} ${utils_1.getCommandAsString(cli, isYarn, task)}`,
        outputs: utils_1.getOutputs(projectGraph.nodes, task),
    }));
}
function serializeProjectGraph(projectGraph) {
    const nodes = Object.values(projectGraph.nodes).map((n) => n.name);
    return { nodes, dependencies: projectGraph.dependencies };
}
function selectPrintAffected(wholeJson, wholeSelect) {
    if (!wholeSelect)
        return wholeJson;
    return _select(wholeJson, wholeSelect);
    function _select(json, select) {
        if (select.indexOf('.') > -1) {
            const [firstKey, ...restKeys] = select.split('.');
            const first = json[firstKey];
            throwIfEmpty(wholeSelect, first);
            const rest = restKeys.join('.');
            if (Array.isArray(first)) {
                return first.map((q) => _select(q, rest)).join(', ');
            }
            else {
                return _select(first, rest);
            }
        }
        else {
            const res = json[select];
            throwIfEmpty(wholeSelect, res);
            if (Array.isArray(res)) {
                return res.join(', ');
            }
            else {
                return res;
            }
        }
    }
}
exports.selectPrintAffected = selectPrintAffected;
function throwIfEmpty(select, value) {
    if (value === undefined) {
        throw new Error(`Cannot select '${select}' in the results of print-affected.`);
    }
}
//# sourceMappingURL=print-affected.js.map