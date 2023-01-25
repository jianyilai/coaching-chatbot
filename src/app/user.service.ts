import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  usersUrl: string = 'https://coaching-chatbot-production-c6a7.up.railway.app/api/users'

  getAllUsers() {
    return this.http.get<any[]>(this.usersUrl);
  }

  getUserByUID() {
    const userId = this.authService.getUserId()
    return this.http.get<any[]>(this.usersUrl + "/" + userId);
  }

  updatePassword(password: string) {
    const userId = this.authService.getUserId()
    return this.http.put<any[]>(this.usersUrl + "/passwordreset/" + userId, {
      'password': password
    });
  }

  updateEmail(email: string) {
    const userId = this.authService.getUserId()
    return this.http.put<any[]>(this.usersUrl + "/emailreset/" + userId, {
      'email': email
    });
  }

  deleteAccount() {
    const userId = this.authService.getUserId()
    return this.http.delete<any[]>(this.usersUrl + "/" + userId);
  }
}
