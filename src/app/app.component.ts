import { Component } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { TodoFacade } from './+state/todo.facade';
import { DeleteComponent } from './components/delete/delete.component';
import { CreateComponent } from './components/create/create.component';
import { UpdateComponent } from './components/update/update.component';
import { TodoEntity } from './+state/todo.models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'todo-ui';

  displayedColumns = ['select', 'name', 'description'];
  selection = new SelectionModel<Element>(true, []);
  public selectedTodo: TodoEntity;

  constructor(private dialog: MatDialog, public todoFacade: TodoFacade) {}

  ngOnInit(): void {
    this.todoFacade.getAllTodo();
  }

  showAddBankDialog() {
    this.dialog.open(CreateComponent);
  }

  showDeleteDialog() {
    this.dialog.open(DeleteComponent, {
      data: {todo: this.selectedTodo}
    });
  }

  showEditDialog() {
    this.dialog.open(UpdateComponent, {
      data: { todo: this.selectedTodo },
    });
  }

}


