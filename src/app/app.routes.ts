import { Routes } from '@angular/router';
import { TaskListComponent } from './tasks/task-list/task-list';
import { TaskFormComponent } from './tasks/task-form/task-form';

export const routes: Routes = [
  { path: '', component: TaskListComponent },
  { path: 'add-task', component: TaskFormComponent },
  { path: 'edit-task/:id', component: TaskFormComponent }
];


