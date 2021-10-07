import { createAction, props } from '@ngrx/store';
import { TodoEntity } from './todo.models';

export const getAllTodo = createAction('[Todo] Get All Todo');

export const getAllTodoSuccess = createAction(
  '[Todo] Get All Todo Success',
  props<{ todo: TodoEntity[] }>()
);

export const getAllTodoFailure = createAction(
  '[Todo] Get All Todo Failure',
  props<{ error: Error }>()
);

export const getTodoById = createAction(
  '[Todo] Get Todo',
  props<{ todoId: string | number }>()
);

export const getTodoByIdSuccess = createAction(
  '[Todo] Get Todo Success',
  props<{ todo: TodoEntity }>()
);

export const getTodoByIdFailure = createAction(
  '[Todo] Get Todo Failure',
  props<{ error: any }>()
);

export const createTodo = createAction(
  '[Todo] Create Todo',
  (todoDetails: TodoEntity) => ({ todoDetails })
);

export const createTodoSuccess = createAction(
  '[Todo] Create Todo Success',
  (todoDetails: TodoEntity) => ({ todoDetails })
);

export const createTodoFailure = createAction(
  '[Todo] Create Todo Failure',
  props<{ error: Error }>()
);

export const deleteTodo = createAction(
  '[Todo] Delete Todo',
  props<{ todoId: number }>()
);


export const deleteAll = createAction(
  '[Todo] Delete Todo',
);
export const deleteTodoSuccess = createAction(
  '[Todo] Delete Todo Success',
  (todoId: number) => ({ todoId })
);

export const deleteTodoFailure = createAction(
  '[Todo] Delete Todo Failure',
  props<{ error: Error }>()
);

export const updateTodo = createAction(
  '[Todo] Update Todo',
  (todoDetails: TodoEntity) => ({ todoDetails })
);

export const updateTodoSuccess = createAction(
  '[Todo] Update Todo Success',
  (todoDetails: TodoEntity) => ({ todoDetails })
);

export const updateTodoFailure = createAction(
  '[Todo] Update Todo Failure',
  props<{ error: Error }>()
);
