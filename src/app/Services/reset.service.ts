import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../ApiUrl';
import { ResetPassword } from '../Models/reset-password';

@Injectable({
  providedIn: 'root',
})
export class ResetService {
  constructor(private http: HttpClient) {}

  reset_api_url = API_URL + 'Auth';

  sendResetPasswordLink(email: string) {
    return this.http.post<any>(
      this.reset_api_url + `/send-reset-email/${email}`,
      {}
    );
  }

  resetPassword(resetPasswordObj: ResetPassword) {
    return this.http.post<any>(
      this.reset_api_url + `/reset-password`,
      resetPasswordObj
    );
  }
}
