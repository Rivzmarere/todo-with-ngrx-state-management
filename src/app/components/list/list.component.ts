import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TodoEntity } from 'src/app/+state/todo.models';
import { TodoListUiDataSource } from './todo-list-datasource';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements AfterViewInit, OnInit, OnChanges, OnDestroy {
    @Input() todo: TodoEntity[];
    @Output() selectionChanged: EventEmitter<TodoEntity> = new EventEmitter<
    TodoEntity
    >();
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatTable) table: MatTable<TodoEntity>;
    private _unsubscribe = new Subject<void>();
    dataSource: TodoListUiDataSource;
    displayedColumns = ['select', 'name', 'description'];
    public selection: SelectionModel<TodoEntity>;
  
    ngOnInit() {
      this.selection = new SelectionModel<TodoEntity>(false, []);
      this.selection.changed
        .asObservable()
        .pipe(takeUntil(this._unsubscribe))
        .subscribe(() => {
          if (this.selection.selected.length === 1)
            this.selectionChanged.emit(this.selection.selected[0]);
          else this.selectionChanged.emit(null);
        });
    }
  
    ngOnChanges(changes: SimpleChanges) {
      if (changes.todo.currentValue) {
        this.dataSource = new TodoListUiDataSource(this.todo);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        if (this.table) this.table.dataSource = this.dataSource;
      }
    }
  
    ngAfterViewInit() {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.table.dataSource = this.dataSource;
    }
  
    ngOnDestroy() {
      this._unsubscribe.next();
      this._unsubscribe.complete();
    }
  

}
