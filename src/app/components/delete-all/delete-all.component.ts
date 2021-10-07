import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { TodoFacade } from 'src/app/+state/todo.facade';
import { TodoEntity } from 'src/app/+state/todo.models';

@Component({
  selector: 'app-delete-all',
  templateUrl: './delete-all.component.html',
  styleUrls: ['./delete-all.component.scss']
})
export class DeleteAllComponent implements OnInit {
  todo: TodoEntity = this.data.todo;
  private loadedSubscription = new Subscription();

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
              private dialog: MatDialogRef<DeleteAllComponent>,
              public todoFacade: TodoFacade,
              ) {
  }

  ngOnInit(): void {
  }

  async confirm() {
    try {
      console.log(this.data.todo);
      this.todoFacade.deleteTodo(this.data.todo.id.toString())
      this.todoFacade.loaded$.subscribe((res) =>
      res ? this.dialog.close(true) : null
    );
    } catch (e) {
    } finally {
      this.dialog.close();
    }
  }

  ngOnDestroy() {
    this.loadedSubscription.unsubscribe();
  }

}
