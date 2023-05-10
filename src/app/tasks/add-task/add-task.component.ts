import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TaskService } from 'src/app/services/task.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SharedService } from 'src/app/services/shared.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css'],
})
export class AddTaskComponent implements OnInit {
  @Output() addNewTaskEvent = new EventEmitter();
  addTaskForm!: any;

  public errorMessage = '';
  constructor(
    private taskService: TaskService,
    private fb: FormBuilder,
    private SharedService: SharedService,
    private authService: AuthService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.addTaskForm = this.fb.group({
      label: new FormControl('', [Validators.required]),
      content: new FormControl('', [Validators.required]),
    });
  }

  addTask() {
    if (this.addTaskForm.invalid) {
      this.errorMessage = 'Invalid input';
    } else {
      this.taskService.addTask(this.addTaskForm.value).subscribe(
        (res: any) => {
          console.log('res is ', res);
          // reset form
          this.addTaskForm.reset();
          // emit event
          this.SharedService.addTask.next(res);
        },
        (err) => {
          console.log('err is ', err);
          this.errorMessage = err.error.message;
        }
      );
    }
  }

  logOut() {
    this.authService
      .logout()
      .then((res) => {
        this.router.navigate(['/']);
      })
      .catch((err) => {
        console.log('err is ', err);
      });
  }
}
