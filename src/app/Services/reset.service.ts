import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../ApiUrl';
import { ResetPassword } from '../Models/reset-password';
import { ForgetPasswordModel } from '../Models/ForgetPasswordModel';

@Injectable({
  providedIn: 'root',
})
export class ResetService {
  constructor(private http: HttpClient) {}

  reset_api_url = API_URL + 'Auth';

  sendResetPasswordLink(email: string) {
    return this.http.post<any>(
      this.reset_api_url + `/send-forget-email/${email}`,
      {}
    );
  }

  resetPassword(resetPasswordObj: ForgetPasswordModel) {
    return this.http.post<any>(
      this.reset_api_url + `/forget-password`,
      resetPasswordObj
    );
  }
}
