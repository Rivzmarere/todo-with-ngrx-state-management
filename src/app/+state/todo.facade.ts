import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';

import * as fromTodo from './todo.reducer';
import * as TodoSelectors from './todo.selectors';
import * as TodoActions from './todo.actions';
import { TodoEntity } from './todo.models';

@Injectable()
export class TodoFacade {
  loaded$ = this.store.pipe(select(TodoSelectors.getTodoLoaded));
  allTodo$ = this.store.pipe(select(TodoSelectors.getAllTodo));
  selectedTodo$ = this.store.pipe(select(TodoSelectors.getSelectedTodo));
  loading$ = this.store.pipe(select(TodoSelectors.getTodoLoadingState));
  totalTodo$ = this.store.pipe(select(TodoSelectors.getTotalTodo));

  constructor(private store: Store<fromTodo.TodoPartialState>) {}

  getAllTodo() {
    this.store.dispatch(TodoActions.getAllTodo());
  }

  getTodo(todoId: string) {
    this.store.dispatch(TodoActions.getTodoById({ todoId }));
  }

  createNewTodo(todo: TodoEntity) {
    this.store.dispatch(TodoActions.createTodo(todo));
  }

  updateTodo(todo: TodoEntity) {
    this.store.dispatch(TodoActions.updateTodo(todo));
  }

  deleteTodo(todoId: number) {
    this.store.dispatch(TodoActions.deleteTodo({ todoId }));
  }

  deleteAll() {
    this.store.dispatch(TodoActions.deleteAll());
  }
}
