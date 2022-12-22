import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ToDoService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  getAllTasks() {
    return this.http.get<any[]>("https://coaching-bot-app.cloudfunctions.net/getAllTasks");
  }

  getTaskById(_id: string) {
    return this.http.get<any[]>("https://coaching-bot-app.cloudfunctions.net/getTaskById" + "?_id==" + _id);
  }

  getTasksByUID() {
    const userId = this.authService.getUserId()
    return this.http.get<any[]>("https://coaching-bot-app.cloudfunctions.net/getTaskByUserId" + "?userId=" + userId);
  }

  insertTask(title: string, dueBy: Date, reminder: boolean) {
    const userId = this.authService.getUserId()
    return this.http.post<{ insertedId: string }>("https://coaching-bot-app.cloudfunctions.net/createTask", { userId, 'title': title, 'dueBy': dueBy, 'reminder': reminder }).pipe(
      map(response => response.insertedId)
    );
  }

  deleteTask(_id: string) {
    return this.http.delete<any[]>("https://coaching-bot-app.cloudfunctions.net/deleteTask" + "?_id=" + _id);
  }

  updateTask(_id: string, title: string, dueBy: Date, reminder: boolean) {
    const userId = this.authService.getUserId()
    return this.http.put<any[]>("https://coaching-bot-app.cloudfunctions.net/updateTask" + "?_id=" + _id, {
      userId, 'title': title, 'dueBy': dueBy, 'reminder': reminder
    });
  }
}
