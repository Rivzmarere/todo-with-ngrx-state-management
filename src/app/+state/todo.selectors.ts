import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  TODO_FEATURE_KEY,
  State,
  TodoPartialState,
  todoAdapter,
} from './todo.reducer';

export const getTodoState = createFeatureSelector<TodoPartialState, State>(
  TODO_FEATURE_KEY
);

const { selectAll, selectEntities } = todoAdapter.getSelectors();

export const getTodoLoaded = createSelector(
  getTodoState,
  (state: State) => state.loaded
);

export const getTodoError = createSelector(
  getTodoState,
  (state: State) => state.error
);

export const getAllTodo = createSelector(getTodoState, (state: State) =>
  selectAll(state)
);

export const getTodoEntities = createSelector(getTodoState, (state: State) =>
  selectEntities(state)
);

export const getSelectedId = createSelector(
  getTodoState,
  (state: State) => state.selectedId
);

export const getSelected = (todoId: string | number) =>
  createSelector(getTodoEntities, (entities) => entities[todoId]);

export const getSelectedTodo = createSelector(
  getTodoState,
  (state: State) => state.selectedTodo
);

export const getTotalTodo = createSelector(
  getTodoState,
  (state: State) => state.total
);

export const getTodoLoadingState = createSelector(
  getTodoState,
  (state: State) => state.loading
);
