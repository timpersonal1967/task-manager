import { Component, OnInit } from '@angular/core'; 
import { Task } from '../../task';
import { TaskService } from '../../task-service';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({   
  selector: 'app-task-list', 
  standalone: true,
  imports: [
    MatListModule,
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule
  ], 
  templateUrl: './task-list.html' }) 
  
  export class TaskListComponent implements OnInit { 
      
    tasks: Task[] = [];   

    constructor(private taskService: TaskService) {}     
    
    ngOnInit() {     
      this.loadTasks();   
    }     
    
    loadTasks() {     
      this.taskService.getTasks().subscribe(tasks => this.tasks = tasks);  
    }     
    
    deleteTask(id: number) {     
      this.taskService.deleteTask(id).subscribe(() => this.loadTasks());   
    } 
  }