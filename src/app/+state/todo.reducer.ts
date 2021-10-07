import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import * as TodoActions from './todo.actions';
import { TodoEntity } from './todo.models';

export const TODO_FEATURE_KEY = 'todo';

export interface State extends EntityState<TodoEntity> {
  selectedId?: string | number;
  loaded?: boolean;
  loading: boolean;
  error?: Error;
  selectedTodo : TodoEntity;
  total: number;
}

export interface TodoPartialState {
  readonly [TODO_FEATURE_KEY]: State;
}

export const todoAdapter: EntityAdapter<TodoEntity> = createEntityAdapter<
TodoEntity
>();

export const initialState: State = todoAdapter.getInitialState({
  loaded: false,
  loading: false,
  error: undefined,
  selectedTodo: null,
  total: 0,
});

const todoReducer = createReducer(
  initialState,
  on(TodoActions.getTodoById, (state) => ({
    ...state,
    loading: true,
  })),

  on(TodoActions.getAllTodo, (state) =>
  todoAdapter.setAll([], {
      ...state,
      loading: true,
    })
  ),

  on(TodoActions.getTodoByIdSuccess, (state, { todo }) => ({
    ...state,
    loading: false,
    loaded: true,
    selectedTodo: todo,
  })),

  on(TodoActions.getAllTodoSuccess, (state, { todo }) =>
  todoAdapter.setAll(todo, {
      ...state,
      loading: false,
      loaded: true,
    })
  ),

  on(
    TodoActions.getAllTodoFailure,
    TodoActions.getTodoByIdFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      loaded: false,
      error: error,
    })
  ),

  on(
    TodoActions.createTodo,
    TodoActions.updateTodo,
    TodoActions.deleteTodo,
    (state) => ({
      ...state,
      loading: true,
      loaded: false,
      error: null,
    })
  ),

  on(TodoActions.createTodoSuccess, (state, { todoDetails }) =>
  todoAdapter.addOne(todoDetails, {
      ...state,
      loaded: true,
      loading: false,
    })
  ),

  on(TodoActions.updateTodoSuccess, (state, { todoDetails }) =>
  todoAdapter.setOne(todoDetails, {
      ...state,
      loaded: true,
      loading: false,
    })
  ),

  on(TodoActions.deleteTodoSuccess, (state, { todoId }) =>
  todoAdapter.removeOne(todoId, {
      ...state,
      loaded: true,
      loading: false,
    })
  ),

  on(
    TodoActions.createTodoFailure,
    TodoActions.updateTodoFailure,
    TodoActions.deleteTodoFailure,
    (state, { error }) => ({
      ...state,
      error: error,
      loading: false,
    })
  )
);

export function reducer(state: State | undefined, action: Action) {
  return todoReducer(state, action);
}
