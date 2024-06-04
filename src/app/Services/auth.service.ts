import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenApi } from '../Models/token-api';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseURL: string = 'https://localhost:7184/api/Auth';
  userPayload: any;

  constructor(private _http: HttpClient, private router: Router) {
    this.userPayload = this.decodedToken();
  }

  signUp(userObj: any) {
    return this._http.post(this.baseURL + `/register`, userObj);
  }
  login(loginObj: any) {
    return this._http.post(this.baseURL + `/authenticate`, loginObj);
  }
  googleLogin(googleCredentialToken: string) {
    return this._http.get<any>(
      this.baseURL +
        `/google-authenticate?googleCredentialToken=${googleCredentialToken}`
    );
  }
  signout() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['login']);
  }
  storeRefreshToken(tokenValue: string) {
    var encodedRefreshToken = btoa(tokenValue);
    localStorage.setItem('refreshToken', encodedRefreshToken);
  }
  getRefreshToken() {
    var refreshToken = localStorage.getItem('refreshToken');
    return atob(refreshToken || "");
  }
  storeToken(tokenValue: string) {
    let encodedToken = btoa(tokenValue);
    localStorage.setItem('token', encodedToken);
  }
  getToken() {
    var encodedToken =  localStorage.getItem('token');
    return atob(encodedToken || "")
  }
  isLoggedIn(): boolean {
    return !localStorage.getItem('token');
  }

  decodedToken() {
    const jwtHelper = new JwtHelperService();
    const token = this.getToken()!;
    // console.log(jwtHelper.decodeToken(token));
    return jwtHelper.decodeToken(token);
  }

  getFullNameFromToken() {
    if (this.userPayload) {
      return this.userPayload.name;
    }
  }

  getRoleFromToken() {
    if (this.userPayload) {
      return this.userPayload.role;
    }
  }

  getEmailFromToken() {
    if (this.userPayload) {
      return this.userPayload.email;
    }
  }

  getEmployeeIdFromToken() {
    if (this.userPayload) {
      return this.userPayload.employeeId;
    }
  }

  getManagerIdFromToken() {
    if (this.userPayload) {
      // console.log(this.userPayload.managerId)
      return this.userPayload.managerId;
    }
  }

  renewToken(tokenApi: TokenApi) {
    return this._http.post<any>(this.baseURL + `/refresh`, tokenApi);
  }
}
