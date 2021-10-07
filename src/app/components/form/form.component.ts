import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TodoEntity } from 'src/app/+state/todo.models';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  @Input() todo: TodoEntity;
  @Input() title: string;
  @Output() formValue = new EventEmitter();
  public todoForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.createForm();
    if (this.todo) {
      this.todoForm.patchValue(this.todo);
      this.todoForm.get('description').patchValue(this.todo.description);
    }
  }

  public createForm() {
    this.todoForm = this.formBuilder.group({
      description: '',
      name: '',
      id: '',
    });
  }

}
