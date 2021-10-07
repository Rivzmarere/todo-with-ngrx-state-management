"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultTasksRunner = exports.splitTasksIntoStages = void 0;
const tslib_1 = require("tslib");
const runAll = require("npm-run-all");
const rxjs_1 = require("rxjs");
const path_1 = require("path");
const tasks_runner_1 = require("./tasks-runner");
const output_1 = require("../utils/output");
const fileutils_1 = require("../utils/fileutils");
const utils_1 = require("./utils");
const file_utils_1 = require("../core/file-utils");
function taskDependsOnDeps(task, deps, projectGraph) {
    function hasDep(source, target, visitedProjects) {
        if (!projectGraph.dependencies[source]) {
            return false;
        }
        if (projectGraph.dependencies[source].find((d) => d.target === target)) {
            return true;
        }
        return !!projectGraph.dependencies[source].find((r) => {
            if (visitedProjects.indexOf(r.target) > -1)
                return null;
            return hasDep(r.target, target, [...visitedProjects, r.target]);
        });
    }
    return !!deps.find((dep) => hasDep(task.target.project, dep.target.project, []));
}
function topologicallySortTasks(tasks, projectGraph) {
    const visited = {};
    const sorted = [];
    const visitNode = (id) => {
        if (visited[id])
            return;
        visited[id] = true;
        projectGraph.dependencies[id].forEach((d) => {
            visitNode(d.target);
        });
        sorted.push(id);
    };
    tasks.forEach((t) => visitNode(t.target.project));
    const sortedTasks = [...tasks];
    sortedTasks.sort((a, b) => sorted.indexOf(a.target.project) > sorted.indexOf(b.target.project) ? 1 : -1);
    return sortedTasks;
}
function splitTasksIntoStages(tasks, projectGraph) {
    if (tasks.length === 0)
        return [];
    const res = [];
    topologicallySortTasks(tasks, projectGraph).forEach((t) => {
        const stageWithNoDeps = res.find((tasksInStage) => !taskDependsOnDeps(t, tasksInStage, projectGraph));
        if (stageWithNoDeps) {
            stageWithNoDeps.push(t);
        }
        else {
            res.push([t]);
        }
    });
    return res;
}
exports.splitTasksIntoStages = splitTasksIntoStages;
exports.defaultTasksRunner = (tasks, options, context) => {
    return new rxjs_1.Observable((subscriber) => {
        runTasks(tasks, options, context)
            .then((data) => data.forEach((d) => subscriber.next(d)))
            .catch((e) => {
            console.error('Unexpected error:');
            console.error(e);
            process.exit(1);
        })
            .finally(() => {
            subscriber.complete();
            // fix for https://github.com/nrwl/nx/issues/1666
            if (process.stdin['unref'])
                process.stdin.unref();
        });
    });
};
// TODO: delete this tasks runner in Nx 10
function runTasks(tasks, options, context) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const cli = file_utils_1.cliCommand();
        assertPackageJsonScriptExists(cli);
        const isYarn = path_1.basename(process.env.npm_execpath || 'npm').startsWith('yarn');
        const stages = context.target === 'build'
            ? splitTasksIntoStages(tasks, context.projectGraph)
            : [tasks];
        const res = [];
        for (let i = 0; i < stages.length; ++i) {
            const tasksInStage = stages[i];
            try {
                const commands = tasksInStage.map((t) => utils_1.getCommandAsString(cli, isYarn, t));
                yield runAll(commands, {
                    parallel: options.parallel || false,
                    maxParallel: options.maxParallel || 3,
                    continueOnError: true,
                    stdin: process.stdin,
                    stdout: process.stdout,
                    stderr: process.stderr,
                });
                res.push(...tasksToStatuses(tasksInStage, true));
            }
            catch (e) {
                e.results.forEach((result, i) => {
                    res.push({
                        task: tasksInStage[i],
                        type: tasks_runner_1.AffectedEventType.TaskComplete,
                        success: result.code === 0,
                    });
                });
                res.push(...markStagesAsNotSuccessful(stages.splice(i + 1)));
                return res;
            }
        }
        return res;
    });
}
function markStagesAsNotSuccessful(stages) {
    return stages.reduce((m, c) => [...m, ...tasksToStatuses(c, false)], []);
}
function tasksToStatuses(tasks, success) {
    return tasks.map((task) => ({
        task,
        type: tasks_runner_1.AffectedEventType.TaskComplete,
        success,
    }));
}
function assertPackageJsonScriptExists(cli) {
    // Make sure the `package.json` has the `nx: "nx"` command needed by `npm-run-all`
    const packageJson = fileutils_1.readJsonFile('./package.json');
    if (!packageJson.scripts || !packageJson.scripts[cli]) {
        output_1.output.error({
            title: `The "scripts" section of your 'package.json' must contain "${cli}": "${cli}"`,
            bodyLines: [
                output_1.output.colors.gray('...'),
                ' "scripts": {',
                output_1.output.colors.gray('  ...'),
                `   "${cli}": "${cli}"`,
                output_1.output.colors.gray('  ...'),
                ' }',
                output_1.output.colors.gray('...'),
            ],
        });
        return process.exit(1);
    }
}
exports.default = exports.defaultTasksRunner;
//# sourceMappingURL=tasks-runner-v1.js.map