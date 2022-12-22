import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  getAllNotifications() {
    return this.http.get<any[]>("https://coaching-bot-app.cloudfunctions.net/getAllNotifications");
  }

  getNotificationByTaskId(taskId: string) {
    return this.http.get<any[]>("https://coaching-bot-app.cloudfunctions.net/getNotificationsByTaskId" + "?taskId=" + taskId);
  }

  insertNotification(taskId: string, message: string, scheduledTime: Date) {
    const email = this.authService.getUserEmail()
    return this.http.post<any[]>("https://coaching-bot-app.cloudfunctions.net/createNotification", { 'taskId': taskId, email, 'message': message, 'scheduledTime': scheduledTime });
  }

  deleteNotification(_id: string) {
    return this.http.delete<any[]>("https://coaching-bot-app.cloudfunctions.net/deleteNotification" + "?_id" + _id);
  }

  updateNotification(_id: string, taskId: string, message: string, scheduledTime: Date) {
    const email = this.authService.getUserEmail()
    return this.http.put<any[]>("https://coaching-bot-app.cloudfunctions.net/updateNotification" + "?_id" + _id,
      { 'taskId': taskId, email, 'message': message, 'scheduledTime': scheduledTime });
  }
}
