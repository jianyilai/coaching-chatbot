import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EmailValidator } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  regUserUrl: string = "http://localhost:3000/api/reguser/";
  authuser: string = "http://localhost:3000/api/authuser/";

  constructor(private http: HttpClient) { }

  regUser(username: string, email: string, pw: string, role: string) {
    return this.http.post<any[]>(this.regUserUrl, {
      'username': username,
      'email': email,
      'password': pw, 'role': role
    });
  }
  authUser(username: string, pw: string) {
    return this.http.post<any[]>(this.authuser, {
      'username': username,
      'password': pw
    });
  }
  setSecureToken(secure_token: string) {
    sessionStorage.setItem("LoggedIn", secure_token)
  }
  getSecureToken() {
    return sessionStorage.getItem("LoggedIn")
  }
  setUserRole(role: string) {
    sessionStorage.setItem("UserRole", role);
  }
  getUserRole() {
    return sessionStorage.getItem("UserRole")
  }
  logout() {
    sessionStorage.removeItem("LoggedIn");
    sessionStorage.removeItem("UserRole");
  }

  isLoggedIn() {
    return this.getSecureToken() !== null;
  }

  isUser() {
    return (this.getUserRole() == "user");
  }
}
