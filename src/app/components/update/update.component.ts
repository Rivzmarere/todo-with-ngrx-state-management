import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { TodoFacade } from 'src/app/+state/todo.facade';
import { TodoEntity } from 'src/app/+state/todo.models';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {

  private loadedSubscription = new Subscription();

  constructor(
    private dialogRef: MatDialogRef<UpdateComponent>,
    public todoFacade: TodoFacade,
    @Inject(MAT_DIALOG_DATA) public data: { todo: TodoEntity }
  ) {}

  ngOnInit(): void {}

  onSubmit(todo: TodoEntity) {
    this.todoFacade.updateTodo(todo);
    this.todoFacade.loaded$.subscribe((res) =>
      res ? this.dialogRef.close(true) : null
    );
  }

  ngOnDestroy() {
    this.loadedSubscription.unsubscribe();
  }


}
