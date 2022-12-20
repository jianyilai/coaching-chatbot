import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ToDoService {

  tasksUrl: string;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.tasksUrl = "http://localhost:3000/api/tasks";
  }

  getAllTasks() {
    return this.http.get<any[]>(this.tasksUrl);
  }

  getTaskById(_id: string) {
    return this.http.get<any[]>(this.tasksUrl + "/" + _id);
  }

  getTasksByUID() {
    const userId = this.authService.getUserId()
    return this.http.get<any[]>(this.tasksUrl + "/user/" + userId);
  }

  insertTask(title: string, dueBy: Date, reminder: boolean) {
    const userId = this.authService.getUserId()
    return this.http.post<{ insertedId: string }>(this.tasksUrl, { userId, 'title': title, 'dueBy': dueBy, 'reminder': reminder }).pipe(
      map(response => response.insertedId)
    );
  }

  deleteTask(_id: string) {
    return this.http.delete<any[]>(this.tasksUrl + "/" + _id);
  }

  updateTask(_id: string, title: string, dueBy: Date, reminder: boolean) {
    const userId = this.authService.getUserId()
    return this.http.put<any[]>(this.tasksUrl + "/" + _id, {
      userId, 'title': title, 'dueBy': dueBy, 'reminder': reminder
    });
  }
}
