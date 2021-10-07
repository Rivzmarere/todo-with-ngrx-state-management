"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskOrderer = void 0;
class TaskOrderer {
    constructor(options, target, projectGraph) {
        this.options = options;
        this.target = target;
        this.projectGraph = projectGraph;
    }
    splitTasksIntoStages(tasks) {
        if ((this.options.strictlyOrderedTargets || ['build']).indexOf(this.target) === -1)
            return [tasks];
        if (tasks.length === 0)
            return [];
        const res = [];
        this.topologicallySortTasks(tasks).forEach((t) => {
            const stageWithNoDeps = res.find((tasksInStage) => !this.taskDependsOnDeps(t, tasksInStage));
            if (stageWithNoDeps) {
                stageWithNoDeps.push(t);
            }
            else {
                res.push([t]);
            }
        });
        return res;
    }
    taskDependsOnDeps(task, deps) {
        const g = this.projectGraph;
        function hasDep(source, target, visitedProjects) {
            if (!g.dependencies[source]) {
                return false;
            }
            if (g.dependencies[source].find((d) => d.target === target)) {
                return true;
            }
            return !!g.dependencies[source].find((r) => {
                if (visitedProjects.indexOf(r.target) > -1)
                    return null;
                return hasDep(r.target, target, [...visitedProjects, r.target]);
            });
        }
        return !!deps.find((dep) => hasDep(task.target.project, dep.target.project, []));
    }
    topologicallySortTasks(tasks) {
        const visited = {};
        const sorted = [];
        const visitNode = (id) => {
            if (visited[id])
                return;
            visited[id] = true;
            this.projectGraph.dependencies[id].forEach((d) => {
                visitNode(d.target);
            });
            sorted.push(id);
        };
        tasks.forEach((t) => visitNode(t.target.project));
        const sortedTasks = [...tasks];
        sortedTasks.sort((a, b) => sorted.indexOf(a.target.project) > sorted.indexOf(b.target.project)
            ? 1
            : -1);
        return sortedTasks;
    }
}
exports.TaskOrderer = TaskOrderer;
//# sourceMappingURL=task-orderer.js.map