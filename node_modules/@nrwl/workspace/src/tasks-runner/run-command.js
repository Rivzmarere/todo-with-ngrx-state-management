"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRunner = exports.createTask = exports.runCommand = void 0;
const tslib_1 = require("tslib");
const tasks_runner_1 = require("./tasks-runner");
const path_1 = require("path");
const app_root_1 = require("../utils/app-root");
const fileutils_1 = require("../utils/fileutils");
const hasher_1 = require("../core/hasher/hasher");
const project_graph_utils_1 = require("../utils/project-graph-utils");
function runCommand(projectsToRun, projectGraph, { nxJson, workspaceResults }, nxArgs, overrides, reporter, initiatingProject) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        reporter.beforeRun(projectsToRun.map((p) => p.name), nxArgs, overrides);
        const { tasksRunner, tasksOptions } = getRunner(nxArgs, nxJson, Object.assign(Object.assign({}, nxArgs), overrides));
        const tasks = projectsToRun.map((project) => {
            return createTask({
                project,
                target: nxArgs.target,
                configuration: nxArgs.configuration,
                overrides: overrides,
            });
        });
        const hasher = new hasher_1.Hasher(projectGraph, nxJson, tasksOptions);
        const res = yield hasher.hashTasks(tasks);
        for (let i = 0; i < res.length; ++i) {
            tasks[i].hash = res[i].value;
            tasks[i].hashDetails = res[i].details;
        }
        const cached = [];
        tasksRunner(tasks, tasksOptions, {
            initiatingProject: initiatingProject,
            target: nxArgs.target,
            projectGraph,
            nxJson,
        }).subscribe({
            next: (event) => {
                switch (event.type) {
                    case tasks_runner_1.AffectedEventType.TaskComplete: {
                        workspaceResults.setResult(event.task.target.project, event.success);
                        break;
                    }
                    case tasks_runner_1.AffectedEventType.TaskCacheRead: {
                        workspaceResults.setResult(event.task.target.project, event.success);
                        cached.push(event.task.target.project);
                        break;
                    }
                }
            },
            error: console.error,
            complete: () => {
                // fix for https://github.com/nrwl/nx/issues/1666
                if (process.stdin['unref'])
                    process.stdin.unref();
                workspaceResults.saveResults();
                reporter.printResults(nxArgs, workspaceResults.failedProjects, workspaceResults.startedWithFailedProjects, cached);
                if (workspaceResults.hasFailure) {
                    process.exit(1);
                }
            },
        });
    });
}
exports.runCommand = runCommand;
function createTask({ project, target, configuration, overrides, }) {
    const config = project_graph_utils_1.projectHasTargetAndConfiguration(project, target, configuration)
        ? configuration
        : undefined;
    const qualifiedTarget = {
        project: project.name,
        target,
        configuration: config,
    };
    return {
        id: getId(qualifiedTarget),
        target: qualifiedTarget,
        projectRoot: project.data.root,
        overrides: interpolateOverrides(overrides, project.name, project.data),
    };
}
exports.createTask = createTask;
function getId({ project, target, configuration, }) {
    let id = project + ':' + target;
    if (configuration) {
        id += ':' + configuration;
    }
    return id;
}
function getRunner(nxArgs, nxJson, overrides) {
    let runner = nxArgs.runner;
    if (!nxJson.tasksRunnerOptions) {
        const t = require('./default-tasks-runner');
        return {
            tasksRunner: t.defaultTasksRunner,
            tasksOptions: overrides,
        };
    }
    if (!runner && !nxJson.tasksRunnerOptions.default) {
        const t = require('./default-tasks-runner');
        return {
            tasksRunner: t.defaultTasksRunner,
            tasksOptions: overrides,
        };
    }
    runner = runner || 'default';
    if (nxJson.tasksRunnerOptions[runner]) {
        let modulePath = nxJson.tasksRunnerOptions[runner].runner;
        let tasksRunner;
        if (modulePath) {
            if (fileutils_1.isRelativePath(modulePath)) {
                modulePath = path_1.join(app_root_1.appRootPath, modulePath);
            }
            tasksRunner = require(modulePath);
            // to support both babel and ts formats
            if (tasksRunner.default) {
                tasksRunner = tasksRunner.default;
            }
        }
        else {
            tasksRunner = require('./default-tasks-runner').defaultTasksRunner;
        }
        return {
            tasksRunner,
            tasksOptions: Object.assign(Object.assign(Object.assign({}, nxJson.tasksRunnerOptions[runner].options), overrides), { skipNxCache: nxArgs.skipNxCache }),
        };
    }
    else {
        throw new Error(`Could not find runner configuration for ${runner}`);
    }
}
exports.getRunner = getRunner;
function interpolateOverrides(args, projectName, projectMetadata) {
    const interpolatedArgs = Object.assign({}, args);
    Object.entries(interpolatedArgs).forEach(([name, value]) => {
        if (typeof value === 'string') {
            const regex = /{project\.([^}]+)}/g;
            interpolatedArgs[name] = value.replace(regex, (_, group) => {
                if (group.includes('.')) {
                    throw new Error('Only top-level properties can be interpolated');
                }
                if (group === 'name') {
                    return projectName;
                }
                return projectMetadata[group];
            });
        }
    });
    return interpolatedArgs;
}
//# sourceMappingURL=run-command.js.map