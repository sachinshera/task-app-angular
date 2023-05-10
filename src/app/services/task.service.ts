import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly API = `${environment.config.apiUrl}/task`;
  constructor(private http: HttpClient) {}

  getTask(): Observable<any> {
    return this.http.get<any>(`${this.API}`, {
      headers: {
        Authorization: localStorage.getItem('token') as string,
      },
    });
  }

  // add task

  addTask(task: any): Observable<any> {
    return this.http.post<any>(`${this.API}`, task, {
      headers: {
        Authorization: localStorage.getItem('token') as string,
      },
    });
  }

  // update task

  updateTask(task: any): Observable<any> {
    return this.http.put<any>(`${this.API}/${task.id}`, task, {
      headers: {
        Authorization: localStorage.getItem('token') as string,
      },
    });
  }

  // delete task

  deleteTask(id: number): Observable<any> {
    return this.http.delete<any>(`${this.API}/${id}`, {
      headers: {
        Authorization: localStorage.getItem('token') as string,
      },
    });
  }
}
