import { Task, TasksRunner } from './tasks-runner';
import { ProjectGraph } from '../core/project-graph';
export interface DefaultTasksRunnerOptions {
    parallel?: boolean;
    maxParallel?: number;
}
export declare function splitTasksIntoStages(tasks: Task[], projectGraph: ProjectGraph): any[];
export declare const defaultTasksRunner: TasksRunner<DefaultTasksRunnerOptions>;
export default defaultTasksRunner;
