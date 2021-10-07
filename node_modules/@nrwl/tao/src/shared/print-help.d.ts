import { logging } from '@angular-devkit/core';
import { Schema } from './params';
export declare function printHelp(header: string, schema: Schema, logger: logging.Logger): void;
export declare let commandName: string;
export declare let toolDescription: string;
export declare function setCommandNameAndDescription(name: string, description: string): void;
