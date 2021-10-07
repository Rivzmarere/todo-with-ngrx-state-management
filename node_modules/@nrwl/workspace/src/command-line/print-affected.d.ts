import { ProjectGraph, ProjectGraphNode } from '../core/project-graph';
import * as yargs from 'yargs';
import { NxArgs } from './utils';
export declare function printAffected(affectedProjectsWithTargetAndConfig: ProjectGraphNode[], affectedProjects: ProjectGraphNode[], projectGraph: ProjectGraph, nxArgs: NxArgs, overrides: yargs.Arguments): void;
export declare function selectPrintAffected(wholeJson: any, wholeSelect: string): any;
