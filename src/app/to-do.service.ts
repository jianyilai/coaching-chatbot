import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Timestamp } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ToDoService {

  tasksURL: string;
  

  constructor(private http: HttpClient, private authService: AuthService) {
    this.tasksURL = "http://localhost:3000/api/tasks/";
  }

  getAllTasks() {
    return this.http.get<any[]>(this.tasksURL);
  }

  getTasksByUID(userid: string) {
    return this.http.get<any[]>(this.tasksURL + "/" + this.authService.getUserId);
  }

  insertTasks(userid: string, title: string, dueBy: Date) {
    return this.http.post<any[]>(this.tasksURL, { 'userid': this.authService.getUserId, 'title': title, 'dueBy': dueBy });
  }

  deleteTasks(userid: string) {
    return this.http.delete<any[]>(this.tasksURL + "/" + userid);
  }

  updateTasks(userid: string, title: string, dueBy: Date, newuserid: number) {
    return this.http.put<any[]>(this.tasksURL + "/" + userid, {
      'title': title, 'dueBy': dueBy, 'newuserid':
        newuserid
    });
  }
}
