import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { TodoEntity } from '../+state/todo.models';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  public todoList: TodoEntity[] = [
  ];

  constructor() { }

  createTodo(todoDetails: any) {
    let todoItem = new TodoEntity({
      id: this.todoList.length + 1,
      name: todoDetails.name,
      description: todoDetails.description
    });
    this.todoList = Object.assign([], this.todoList);
    this.todoList.push(todoItem);
    return of(todoItem);
  }

  getTodo(todoId: number | string) {
    return of(this.todoList.find(x => x.id === todoId));

  }

  updateTodo(todoDetails) {
    let updateItem = this.todoList.find( a=> a.id === todoDetails?.id);
    let index = this.todoList.indexOf(updateItem);
    this.todoList[index] = todoDetails;
    return of(this.todoList[index])
  }

  deleteTodo(todoId: number | string) {
    var item = this.todoList.findIndex(item => item.id === todoId)
    this.todoList.splice(this.todoList.findIndex(item => item.id === todoId), 1);
    return of(item)
  }

  
  getAllTodo() {
    return of(this.todoList);
  }

}
