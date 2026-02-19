import { Routes } from '@angular/router';
import { TaskListComponent } from './tasks/task-list/task-list';
import { TaskFormComponent } from './tasks/task-form/task-form';
import { About } from './about/about';

export const routes: Routes = [
  { path: '', component: TaskListComponent },
  { path: 'add-task', component: TaskFormComponent },
  { path: 'about', component: About },
  { path: 'edit-task/:id', component: TaskFormComponent }
];


