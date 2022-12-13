import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  usersUrl: string;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.usersUrl = "http://localhost:3000/api/users";
  }

  getAllUsers() {
    return this.http.get<any[]>(this.usersUrl);
  }

  getUserByUID() {
    const userId = this.authService.getUserId()
    console.log(userId)
    return this.http.get<any[]>(this.usersUrl + "/" + userId);
  }

  updatePassword(password: string) {
    const userId = this.authService.getUserId
    return this.http.put<any[]>(this.usersUrl + "/passwordreset/" + userId, {
      'password': password
    });
  }
}
