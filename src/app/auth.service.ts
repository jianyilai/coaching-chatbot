import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  regUserUrl: string = "http://localhost:3000/api/reguser/";
  authuser: string = "http://localhost:3000/api/authuser/";

  helper = new JwtHelperService();

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

  loggedIn(secure_token: string) {
    sessionStorage.setItem("LoggedIn", secure_token)
  }

  //check for loggedIn
  getSecureToken() {
    return String(sessionStorage.getItem("LoggedIn"))
  }

  isLoggedIn() {
    return this.getSecureToken() !== null;
  }

  //decode the JWT token to for 'user' role
  getUserRole() {
    var token = this.getSecureToken();
    return this.helper.decodeToken(token).role
  }

  //decode the JWT token for user's email
  getUserEmail() {
    var token = this.getSecureToken();
    return this.helper.decodeToken(token).role
  }

  logout() {
    sessionStorage.removeItem("LoggedIn");
  }

  isUser() {
    return (this.getUserRole() == "user");
  }
}
