import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { TodoFacade } from 'src/app/+state/todo.facade';
import { TodoEntity } from 'src/app/+state/todo.models';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  private loadedSubscription = new Subscription();

  constructor(
    private dialogRef: MatDialogRef<CreateComponent>,
    public todoFacade: TodoFacade
  ) {}

  ngOnInit(): void {}

  onSubmit(todo: TodoEntity) {
    this.todoFacade.createNewTodo(todo);
    this.todoFacade.loaded$.subscribe((res) =>
      res ? this.dialogRef.close(true) : null
    );
  }

  ngOnDestroy() {
    this.loadedSubscription.unsubscribe();
  }


}
