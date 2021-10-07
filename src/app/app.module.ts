import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { UpdateComponent } from './components/update/update.component';
import { DeleteComponent } from './components/delete/delete.component';
import { CreateComponent } from './components/create/create.component';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TodoFacade } from './+state/todo.facade';
import { FormComponent } from './components/form/form.component';
import { TodoEffects } from './+state/todo.effects';
import * as fromTodo from './+state/todo.reducer';
import { ListComponent } from './components/list/list.component';
import { DeleteAllComponent } from './components/delete-all/delete-all.component';

@NgModule({
  declarations: [
    AppComponent,
    UpdateComponent,
    DeleteComponent,
    CreateComponent,
    FormComponent,
    ListComponent,
    DeleteAllComponent
  ],
  
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    CommonModule,
    StoreModule.forRoot({}),
    StoreModule.forFeature(fromTodo.TODO_FEATURE_KEY, fromTodo.reducer),
    EffectsModule.forRoot(),
    EffectsModule.forFeature([TodoEffects]),

  ],
  providers: [TodoFacade],
  bootstrap: [AppComponent]
})
export class AppModule { }
