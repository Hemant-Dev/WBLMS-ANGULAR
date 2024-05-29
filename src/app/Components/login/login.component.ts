declare var google: any;
import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  NgZone,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EncodeForms } from 'src/app/Helpers/encodeForms';
import { errorToast, successToast } from 'src/app/Helpers/swal';
import ValidateForm from 'src/app/Helpers/validateform';
import { AuthService } from 'src/app/Services/auth.service';
import { ResetService } from 'src/app/Services/reset.service';
import { UserStoreService } from 'src/app/Services/user-store.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa fa-eye-slash';

  loginForm!: FormGroup;
  public resetPasswordEmail!: string;
  public isValidEmail!: boolean;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private userStore: UserStoreService,
    private resetService: ResetService,
    private ngZone: NgZone
  ) {}
  ngOnInit(): void {
    this.loginForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(25),
          ],
        ],
      },
      []
    );
  }

  hideShowPassword() {
    this.isText = !this.isText;
    this.isText
      ? (this.eyeIcon = 'fa fa-eye')
      : (this.eyeIcon = 'fa fa-eye-slash');
    this.isText ? (this.type = 'text') : (this.type = 'password');
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.auth.login(this.loginForm.value).subscribe({
        next: (res: any) => {
          this.loginForm.reset();
          this.auth.storeToken(res.accessToken);
          this.auth.storeRefreshToken(res.refreshToken);
          const tokenPayload = this.auth.decodedToken();
          console.log(tokenPayload);
          this.userStore.setFullNameToStore(
            EncodeForms.htmlDecode(tokenPayload.name)
          );
          this.userStore.setRoleToStore(tokenPayload.role);
          this.userStore.setEmailToStore(tokenPayload.email);
          this.userStore.setEmployeeIdToStore(tokenPayload.employeeId);
          // this.router.navigate(['home/dashboard']);
          window.location.href = 'home/dashboard';

          successToast('Logged in successfully!');
        },
        error: (err: Error) => {
          //console.log(err);
          //errorToast(err.message);
        },
      });
    } else {
      ValidateForm.validateAllFormFields(this.loginForm);
      // errorToast('Login Form is invalid!');
    }
  }

  checkValidEmail(event: string) {
    const value = event;
    const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/;
    this.isValidEmail = pattern.test(value);
    return this.isValidEmail;
  }

  confirmToSend() {
    if (this.checkValidEmail(this.resetPasswordEmail)) {
      // console.log(this.resetPasswordEmail);

      // API Call
      this.resetService
        .sendResetPasswordLink(this.resetPasswordEmail)
        .subscribe({
          next: (res) => {
            successToast('Reset Link sent Successfully!');
            this.resetPasswordEmail = '';
            const buttonRef = document.getElementById('closeBtn');
            buttonRef?.click();
          },
          // error: (err) => {
          //   errorToast('Something went wrong');
          // },
        });
    } else {
      errorToast('Invalid Email');
    }
  }
  decodeToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }
  handleGoogleLogin(response: any) {
    if (response) {
      //decode
      localStorage.clear();
      localStorage.setItem('token', response.credential);
      this.auth.googleLogin(response.credential).subscribe({
        next: (res) => {
          this.loginForm.reset();
          this.auth.storeToken(res.accessToken);
          this.auth.storeRefreshToken(res.refreshToken);
          const tokenPayload = this.auth.decodedToken();
          this.userStore.setFullNameToStore(tokenPayload.name);
          this.userStore.setRoleToStore(tokenPayload.role);
          this.ngZone.run(() => this.router.navigate(['dashboard']));
        },
        error: (err) => console.log(err),
      });
    }
  }
}
