import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmPasswordValidator } from 'src/app/Helpers/confirm-password.validator';
import { errorToast, successToast } from 'src/app/Helpers/swal';
import ValidateForm from 'src/app/Helpers/validateform';
import { ForgetPasswordModel } from 'src/app/Models/ForgetPasswordModel';
import { ResetPassword } from 'src/app/Models/reset-password';
import { ResetService } from 'src/app/Services/reset.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  forgetPasswordForm!: FormGroup;
  emailToReset!: string;
  emailToken!: string;
  forgetPasswordObj = new ForgetPasswordModel();
  passwordNotSame! : boolean;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private resetService: ResetService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.forgetPasswordForm = this.fb.group(
      {
        newPassword: [
          null, 
          [Validators.required,
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,25}$/
            ),
          ]
        ],
        confirmPassword: [null, Validators.required],
      }
      // {
      //   validator: ConfirmPasswordValidator('password', 'confirmPassword'),
      // }
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
    if(!this.isNewPWSameAsConfirmPW()){
      errorToast("New Password and confirm password doesnt match")
      return;
    }
    if (this.forgetPasswordForm.valid) {
      console.log(this.forgetPasswordForm)
      console.log(this.forgetPasswordObj)
      this.forgetPasswordObj.email = this.emailToReset;
      this.forgetPasswordObj.newPassword = this.forgetPasswordForm.value.newPassword;
      // this.forgetPasswordObj.confirmPassword = 
      this.forgetPasswordForm.value.confirmPassword;
      this.forgetPasswordObj.emailToken = this.emailToken;
      this.resetService.resetPassword(this.forgetPasswordObj).subscribe({
        next: (res) => {
          // let parsedRes = JSON.parse(res);
          successToast('Password Reset Successfull!');
          this.router.navigate(['login']);
        },
        error: (err) => {
          let parseErr = JSON.parse(err);
          // console.log(parseErr);
          errorToast(parseErr.message);
        },
      });
    } else {
      ValidateForm.validateAllFormFields(this.forgetPasswordForm);
    }
  }

  isNewPWSameAsConfirmPW() : boolean{
    var newPass = this.forgetPasswordForm.value.newPassword
    var confirmPass = this.forgetPasswordForm.value.confirmPassword
    this.passwordNotSame = newPass == confirmPass;
    // console.log("this.passwordNotSame => "+ this.passwordNotSame)
    
    return this.passwordNotSame;
  }

  type : string = 'password';
  isText : boolean = false;
  eyeIcon : string = 'fa fa-eye-slash';

  hideShowPassword(){
    this.isText = !this.isText;

    this.isText 
      ? (this.eyeIcon = 'fa fa-eye')
      : (this.eyeIcon = 'fa fa-eye-slash');

    this.isText 
      ? (this.type = 'text')
      : (this.type = 'password') 

  }

}
