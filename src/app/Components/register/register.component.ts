import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import ValidateForm from 'src/app/Helpers/validateform';
import { EmployeeModel } from 'src/app/Models/EmployeeModel';
import { AuthService } from 'src/app/Services/auth.service';
import { GetEmployeeAsync, CreateEmployeeAsync } from 'src/app/Services/employee.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {


  initialEmployeeData: EmployeeModel = {
    id: 0,
    firstName: '',
    lastName: '',
    password: '',
    emailAddress: '',
    contactNumber: '',
    genderId: 1,
    roleId: 1,
    managerId: 1,
    createdById: 1
  }

  employees: EmployeeModel[] = [];
  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'emailAddress', 'contactNumber'];
  searchText: string = '';


  async ngOnInit() {
    await this.getAllEmployee();
  }

  async getAllEmployee() {
    try {
      const result = await GetEmployeeAsync(this.initialEmployeeData, "firstname", "asc", 1, 5);
      console.log(result)
      this.employees = result.dataArray;
    } catch (error) {
      console.log(error)
    }
  }

  async handleSubmit() {
    try {
      const result = await CreateEmployeeAsync(this.initialEmployeeData);
    } catch (error) {
      console.log(error)
    }
  }
  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa fa-eye-slash';

  signupForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
  ) { }

  onSubmit() {
    if (this.signupForm.valid) {
      // console.log(this.signupForm.value);
      this.auth.signUp(this.signupForm.value).subscribe({
        next: (res: any) => {
          // const response = res as Response;
          // alert(response.message);

          this.signupForm.reset();
          this.router.navigate(['login']);
        },
        error: (err) => {

          console.log(err);
        },
      });
    } else {
      console.log('Form is Invalid');
      ValidateForm.validateAllFormFields(this.signupForm);
    }
  }
  hideShowPassword() {
    this.isText = !this.isText;
    this.isText
      ? (this.eyeIcon = 'fa fa-eye')
      : (this.eyeIcon = 'fa fa-eye-slash');
    this.isText ? (this.type = 'text') : (this.type = 'password');
  }

}