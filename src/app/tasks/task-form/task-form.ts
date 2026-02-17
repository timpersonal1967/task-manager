import { Component, OnInit } from '@angular/core'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'; 
import { TaskService } from '../../task-service'; 
import { Task } from '../../task';   
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';

@Component({   
  standalone: true,
  imports: [
    MatCheckboxModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatIconModule
  ], 
  selector: 'app-task-form',   
  templateUrl: './task-form.html'
})

export class TaskFormComponent implements OnInit {  
  form: FormGroup;   
  editing = false;   
  taskId?: number;     
  
  constructor(     
    private fb: FormBuilder,    
    private route: ActivatedRoute,     
    private router: Router,    
    private taskService: TaskService   ) { 
         
      this.form = this.fb.group({       
        title: ['', Validators.required],       
        description: [''],      
        completed: [false]    
      });   
    }    
    
    ngOnInit() {  
         
      this.taskId = +this.route.snapshot.paramMap.get('id')!;     
      if (this.taskId) {       
        this.editing = true;       
        this.taskService.getTask(this.taskId).subscribe(task => this.form.patchValue(task));     
      }   
    }     
    
    saveTask() {     
      if (this.form.invalid) return;    
      const task: Task = { ...this.form.value, id: this.taskId };       
      const save = this.editing       
                   ? this.taskService.updateTask(task)       
                   : this.taskService.addTask(task);       
      
      save.subscribe(() => this.router.navigate(['/']));  
    
    } 
  }