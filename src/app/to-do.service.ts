import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Timestamp } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ToDoService {

  tasksUrl: string;


  constructor(private http: HttpClient, private authService: AuthService) {
    this.tasksUrl = "http://localhost:3000/api/tasks/";
  }

  getAllTasks() {
    return this.http.get<any[]>(this.tasksUrl);
  }

  getTasksByUID() {
    const userId = this.authService.getUserId
    return this.http.get<any[]>(this.tasksUrl + "/user/" + userId);
  }

  insertTasks(title: string, dueBy: Date) {
    const userId = this.authService.getUserId
    return this.http.post<any[]>(this.tasksUrl, { userId, 'title': title, 'dueBy': dueBy });
  }

  deleteTasks(_id: string) {
    return this.http.delete<any[]>(this.tasksUrl + "/" + _id);
  }

  updateTasks(_id: string, title: string, dueBy: Date) {
    return this.http.put<any[]>(this.tasksUrl + "/" + _id, {
      'title': title, 'dueBy': dueBy, 'userId':
        this.authService.getUserId
    });
  }
}
