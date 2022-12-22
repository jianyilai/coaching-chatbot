import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  getAllUsers() {
    return this.http.get<any[]>("https://coaching-bot-app.cloudfunctions.net/getAllUsers");
  }

  getUserByUID() {
    const userId = this.authService.getUserId()
    return this.http.get<any[]>("https://coaching-bot-app.cloudfunctions.net/users" + "?userId=" + userId);
  }

  updatePassword(password: string) {
    const userId = this.authService.getUserId()
    return this.http.put<any[]>("https://coaching-bot-app.cloudfunctions.net/changePassword" + "?userId=" + userId, {
      'password': password
    });
  }

  updateEmail(email: string) {
    const userId = this.authService.getUserId()
    return this.http.put<any[]>("https://coaching-bot-app.cloudfunctions.net/changeEmail" + "?userId=" + userId, {
      'email': email
    });
  }
}
