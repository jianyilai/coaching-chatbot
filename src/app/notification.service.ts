import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  notificationsUrl: string = "https://coaching-chatbot-production.up.railway.app/api/notifications"

  getAllNotifications() {
    return this.http.get<any[]>(this.notificationsUrl);
  }

  getNotificationByTaskId(taskId: string) {
    return this.http.get<any[]>(this.notificationsUrl + "/" + taskId);
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
