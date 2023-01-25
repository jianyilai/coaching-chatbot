import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  helper = new JwtHelperService();

  constructor(private http: HttpClient) { }

  reguserUrl: string = "https://coaching-chatbot-production-c6a7.up.railway.app/api/reguser"
  authuserUrl: string = "https://coaching-chatbot-production-c6a7.up.railway.app/api/authuser"

  regUser(username: string, email: string, pw: string, role: string) {
    return this.http.post<any[]>(this.reguserUrl, {
      'username': username,
      'email': email,
      'password': pw, 'role': role
    });
  }
  authUser(username: string, pw: string) {
    return this.http.post<any[]>(this.authuserUrl, {
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
    if ("LoggedIn" in sessionStorage) {
      return true
    } else {
      return false
    }
  }

  //decode the JWT token to for user's role
  getUserRole() {
    var token = this.getSecureToken();
    return this.helper.decodeToken(token).role
  }

  //decode the JWT token for userId
  getUserId() {
    var token = this.getSecureToken();
    return this.helper.decodeToken(token).userId
  }

  //decode the JWT token for user's email
  getUserEmail() {
    var token = this.getSecureToken();
    return this.helper.decodeToken(token).email
  }

  getUsername() {
    var token = this.getSecureToken();
    return this.helper.decodeToken(token).name
  }

  logout() {
    sessionStorage.removeItem("LoggedIn");
  }

  isUser() {
    return (this.getUserRole() == "user");
  }
}
