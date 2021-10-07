import { BuilderContext } from '@angular-devkit/architect';
import { Observable } from 'rxjs';
import { CypressBuilderOptions } from './cypress.impl';
export declare function legacyCompile(options: CypressBuilderOptions, context: BuilderContext): Observable<string>;
