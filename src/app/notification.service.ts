import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  notificationsUrl: string;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.notificationsUrl = "http://localhost:3000/api/notifications";
  }

  getAllTasks() {
    return this.http.get<any[]>(this.notificationsUrl);
  }

  // getTaskById(_id: string) {
  //   return this.http.get<any[]>(this.notificationsUrl + "/" + _id);
  // }

  getNotificationByTaskId(taskId: string) {
    return this.http.get<any[]>(this.notificationsUrl + "/task/" + taskId);
  }

  insertNotification(taskId: string, message: string, scheduledTime: Date) {
    const email = this.authService.getUserEmail()
    return this.http.post<any[]>(this.notificationsUrl, { 'taskId': taskId, email, 'message': message, 'scheduledTime': scheduledTime });
  }

  deleteNotification(_id: string) {
    return this.http.delete<any[]>(this.notificationsUrl + "/" + _id);
  }

  updateNotification(_id: string, taskId: string, message: string, scheduledTime: Date) {
    const email = this.authService.getUserEmail()
    return this.http.put<any[]>(this.notificationsUrl + "/" + _id,
      { 'taskId': taskId, email, 'message': message, 'scheduledTime': scheduledTime });
  }
}
