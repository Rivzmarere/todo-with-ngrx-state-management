import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';

import * as fromTodo from './todo.reducer';
import * as TodoActions from './todo.actions';
import * as TodoSelectors from './todo.selectors';
import {
  mergeMap,
  map,
  catchError,
  exhaustMap,
  concatMap,
  withLatestFrom,
  tap,
  switchMap,
} from 'rxjs/operators';
import { of } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { TodoService } from '../services/todo.service';

@Injectable()
export class TodoEffects {
  loadTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.getTodoById),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(
            this.store.pipe(select(TodoSelectors.getSelected(action.todoId)))
          )
        )
      ),
      switchMap(([action, cachedTodo]) => {
        if (cachedTodo)
          return of(
            TodoActions.getTodoByIdSuccess({
              todo: cachedTodo,
            })
          );

        return this.todoService.getTodo(action.todoId).pipe(
          map((todo) => TodoActions.getTodoByIdSuccess({ todo })),
          catchError((error) =>
            of(TodoActions.getTodoByIdFailure({ error }))
          )
        );
      })
    )
  );

  loadAllTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.getAllTodo),
      exhaustMap(() =>
        this.todoService.getAllTodo().pipe(
          map((todo) => TodoActions.getAllTodoSuccess({ todo })),
          catchError((error) => of(TodoActions.getAllTodoFailure({ error })))
        )
      )
    )
  );

  createTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.createTodo),
      mergeMap((action) =>
        this.todoService.createTodo(action.todoDetails).pipe(
          map((todo) => TodoActions.createTodoSuccess(todo)),
          catchError((error) => of(TodoActions.createTodoFailure({ error })))
        )
      )
    )
  );

  

  updateTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.updateTodo),
      mergeMap((action) =>
        this.todoService.updateTodo(action.todoDetails).pipe(
          map((todo) => TodoActions.updateTodoSuccess(todo)),
          catchError((error) => of(TodoActions.updateTodoFailure({ error })))
        )
      )
    )
  );

  deleteTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.deleteTodo),
      mergeMap((action) =>
        this.todoService.deleteTodo(action.todoId).pipe(
          map((todo) => TodoActions.deleteTodoSuccess(action.todoId)),
          catchError((error) => of(TodoActions.deleteTodoFailure({ error })))
        )
      )
    )
  );

  deleteAll$ = createEffect(() =>
  this.actions$.pipe(
    ofType(TodoActions.deleteTodo),
    mergeMap((action) =>
      this.todoService.deleteTodo(action.todoId).pipe(
        map((todo) => TodoActions.deleteTodoSuccess(action.todoId)),
        catchError((error) => of(TodoActions.deleteTodoFailure({ error })))
      )
    )
  )
);

  onSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          TodoActions.createTodoSuccess,
          TodoActions.updateTodoSuccess,
          TodoActions.deleteTodoSuccess
        ),
        //tap(() => Utilities.displayToast('success'))
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private todoService: TodoService,
    private store: Store<fromTodo.TodoPartialState>
  ) {}
}
