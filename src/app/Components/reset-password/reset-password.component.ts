import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmPasswordValidator } from 'src/app/Helpers/confirm-password.validator';
import { errorToast, successToast } from 'src/app/Helpers/swal';
import ValidateForm from 'src/app/Helpers/validateform';
import { ResetPassword } from 'src/app/Models/reset-password';
import { ResetService } from 'src/app/Services/reset.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  emailToReset!: string;
  emailToken!: string;
  resetPasswordObj = new ResetPassword();

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private resetService: ResetService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group(
      {
        password: [null, Validators.required],
        oldPassword: [null, Validators.required],
      },
      {
        validator: ConfirmPasswordValidator('password', 'confirmPassword'),
      }
    );

    this.activatedRoute.queryParams.subscribe({
      next: (val) => {
        this.emailToReset = val['email'];
        let uriToken = val['token'];
        this.emailToken = uriToken.replace(/ /g, '+');
      },
      error: (err) => console.log(err),
    });
  }

  onSubmit() {
    if (this.resetPasswordForm.valid) {
      this.resetPasswordObj.email = this.emailToReset;
      this.resetPasswordObj.newPassword = this.resetPasswordForm.value.password;
      this.resetPasswordObj.oldPassword =
        this.resetPasswordForm.value.oldPassword;
      this.resetPasswordObj.emailToken = this.emailToken;
      this.resetService.resetPassword(this.resetPasswordObj).subscribe({
        next: (res) => {
          successToast('Password Reset Successfull.');
          this.router.navigate(['login']);
        },
        error: (err) => errorToast(err),
      });
    } else {
      ValidateForm.validateAllFormFields(this.resetPasswordForm);
    }
  }
}
