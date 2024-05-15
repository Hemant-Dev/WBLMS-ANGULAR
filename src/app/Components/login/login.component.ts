declare var google: any;
import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import ValidateForm from 'src/app/Helpers/validateform';
import { AuthService } from 'src/app/Services/auth.service';
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
    // private toast: NgToastService,
    private userStore: UserStoreService,
    // private resetService: ResetPasswordService,
    private ngZone: NgZone
  ) {}
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
    // google.accounts.id.initialize({
    //   client_id:
    //     '305979783667-3cq7k7pbggp74drkgdku7m93a83nqv9d.apps.googleusercontent.com',
    //   callback: (resp: any) => {
    //     // console.log(resp);
    //     this.handleGoogleLogin(resp);
    //   },
    //   auto_select: false,
    //   cancel_on_tap_outside: true,
    // });
    // google.accounts.id.renderButton(document.getElementById('google'), {
    //   theme: 'filled_blue',
    //   size: 'large',
    //   shape: 'rectangle',
    //   width: '100',
    // });
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
      // console.log(this.loginForm.value);
      this.auth.login(this.loginForm.value).subscribe({
        next: (res: any) => {
          this.loginForm.reset();
          this.auth.storeToken(res.accessToken);
          this.auth.storeRefreshToken(res.refreshToken);
          const tokenPayload = this.auth.decodedToken();
          this.userStore.setFullNameToStore(tokenPayload.name);
          this.userStore.setRoleToStore(tokenPayload.role);
          this.router.navigate(['home']);
          // this.toast.success({
          //   detail: 'Success',
          //   summary: res.message,
          //   duration: 3000,
          // });
        },
        error: (err) => console.log(err),
        // this.toast.error({
        //   detail: 'Error',
        //   summary: err,
        //   duration: 3000,
        // }),
      });
    } else {
      console.log('Form is invalid');
      ValidateForm.validateAllFormFields(this.loginForm);
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
      console.log(this.resetPasswordEmail);

      // API Call
      // this.resetService
      //   .sendResetPasswordLink(this.resetPasswordEmail)
      //   .subscribe({
      //     next: (res) => {
      //       this.toast.success({
      //         detail: 'Success',
      //         summary: 'Reset Link sent Successfully!',
      //         duration: 3000,
      //       });
      //       this.resetPasswordEmail = '';
      //       const buttonRef = document.getElementById('closeBtn');
      //       buttonRef?.click();
      //     },
      //     error: (err) => {
      //       this.toast.error({
      //         detail: 'Error',
      //         summary: 'Something went wrong: ' + err.error,
      //         duration: 3000,
      //       });
      //     },
      //   });
    } else {
      console.log('Invalid Email');
    }
  }
  decodeToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }
  handleGoogleLogin(response: any) {
    if (response) {
      //decode
      // console.log(response);
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
          // this.toast.success({
          //   detail: 'Success',
          //   summary: 'Google Login Successfull.',
          //   duration: 3000,
          // });
        },
        error: (err) => console.log(err),
        // this.toast.error({
        //   detail: 'Error',
        //   summary: err,
        //   duration: 3000,
        // }),
      });
      //navigate to dashboard
      // Verify the user
      // this.ngZone.run(() => this.router.navigate(['dashboard']));
    }
  }
}
