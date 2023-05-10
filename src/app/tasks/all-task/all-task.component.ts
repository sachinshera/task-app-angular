import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { TaskService } from 'src/app/services/task.service';
import { AddTaskComponent } from '../add-task/add-task.component';
import { SharedService } from 'src/app/services/shared.service';
import { Subscription } from 'rxjs';
import {
  ModalDismissReasons,
  NgbDatepickerModule,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
@Component({
  selector: 'app-all-task',
  templateUrl: './all-task.component.html',
  styleUrls: ['./all-task.component.css'],
})
export class AllTaskComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modalEl!: ElementRef;
  tasks: any[] = [];
  sub!: Subscription;
  updateTaskForm!: any;
  public UpdatingTaskId: any;
  public errorMessage = '';
  public editingTaskLabel: any;
  public editingTaskContent: any;
  deleteTask(id: any) {
    this.taskService.deleteTask(id).subscribe((res: any) => {
      this.tasks = this.tasks.filter((task) => task.id !== id);
    });
  }
  editTask(id: any) {
    // show bootstrap modal
  }

  constructor(
    private taskService: TaskService,
    private SharedService: SharedService,
    private fb: FormBuilder,
    private modalService: NgbModal
  ) {}
  ngOnDestroy(): void {
    // this.sub.unsubscribe();
  }
  ngOnInit(): void {
    this.taskService.getTask().subscribe((res: any) => {
      this.tasks = res;
    });
    this.SharedService.addTask.subscribe((res: any) => {
      this.tasks.unshift(res);
    });
    this.updateTaskForm = this.fb.group({
      label: new FormControl('', [Validators.required]),
      content: new FormControl('', [Validators.required]),
    });
  }

  updateTask() {
    if (this.updateTaskForm.invalid) {
      this.errorMessage = 'Invalid input';
    } else {
      let data = {
        id: this.UpdatingTaskId,
        label: this.updateTaskForm.value.label,
        content: this.updateTaskForm.value.content,
      };
      this.taskService.updateTask(data).subscribe(
        (res: any) => {
          console.log('res is ', res);
          this.updateTaskForm.reset();

          // update tasks array

          const taskIndex = this.tasks.findIndex((task) => {
            return task.id === this.UpdatingTaskId;
          });

          this.tasks[taskIndex] = res;
          // close modal

          this.modalService.dismissAll();
        },
        (err) => {
          console.log('err is ', err);
          this.errorMessage = err.error.message;
        }
      );
    }
  }
  closeResult = '';
  open(content: any, id: string) {
    this.UpdatingTaskId = id;
    console.log('id is ', this.UpdatingTaskId);

    // get task by id from tasks array

    const task = this.tasks.find((task) => task.id === id);

    // set editingTaskLabel and editingTaskContent

    // set label and content

    this.updateTaskForm.patchValue({
      label: task?.label,
      content: task?.content,
    });
    console.log('this.updateTaskForm.value is ', this.updateTaskForm.value);

    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
