import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EncodeForms } from 'src/app/Helpers/encodeForms';
import { errorToast, successToast } from 'src/app/Helpers/swal';
import ValidateForm from 'src/app/Helpers/validateform';
import { EmployeeModel } from 'src/app/Models/EmployeeModel';
import { GenderModel } from 'src/app/Models/GenderModel';
import { ManagerModel } from 'src/app/Models/ManagerModel';
import { RolesModel } from 'src/app/Models/RolesModels';
import { EmployeeRxjsService } from 'src/app/Services/employee-rxjs.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  initialEmployeeData: EmployeeModel = {
    id: 0,
    firstName: '',
    lastName: '',
    password: 'First@123',
    emailAddress: '',
    contactNumber: '',
    genderId: 0,
    roleId: 0,
    managerId: 0,
    createdById: 1,
  };

  gendersData!: GenderModel[];
  roleData!: RolesModel[];
  managerData!: ManagerModel[];

  employees: EmployeeModel[] = [];

  displayedColumns: string[] = [
    'id',
    'firstName',
    'lastName',
    'emailAddress',
    'contactNumber',
  ];

  constructor(
    private employeeService: EmployeeRxjsService,
    private fb: FormBuilder,
    // private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }
  registerForm!: FormGroup;

  ngOnInit() {
    this.initialEmployeeData.id = Number(
      this.route.snapshot.paramMap.get('id')
    );
    this.fetchData();

    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(20)]],
      lastName: ['', [Validators.required, Validators.maxLength(20)]],
      contactNumber: [
        '',
        [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)],
      ],
      genderId: [0, Validators.required],
      roleId: [0, Validators.required],
      managerId: new FormControl({ value: 0, disabled: true }, [
        Validators.required,
      ]),
      // managerId: [0, Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,25}$/
          ),
        ],
      ],
    });
    this.onChangeRole();
  }

  async handleSubmit() {
    console.log(this.registerForm.value);
    this.registerForm.patchValue({
      firstName: EncodeForms.htmlEncode(this.getValue('firstName')),
      lastName: EncodeForms.htmlEncode(this.getValue('lastName')),
    });

    if (this.registerForm.valid) {
      if (this.initialEmployeeData.id) {
        try {
          this.employeeService
            .updateEmployeesById(this.initialEmployeeData)
            .subscribe({
              next: (response: any) => {
                // console.log(response);
              },
              error: (err) => {
                errorToast(err.error.errorMessages);
              },
            });
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          // console.log('Submit');
          this.employeeService
            .createEmployees(this.registerForm.value)
            .subscribe({
              next: (response: any) => {
                // console.log(response);
                // this.initialEmployeeData = response.data;
                successToast('Employee Added Successfully');
                this.router.navigate(['home/showAllEmployees']);
              },
              error: (err) => {
                errorToast(err.error.errorMessages);
              },
            });
        } catch (error) {
          console.log(error);
        }
      }
      // console.log('submit');
    } else {
      // console.log('invalid');
      ValidateForm.validateAllFormFields(this.registerForm);
    }
  }
  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa fa-eye-slash';

  signupForm!: FormGroup;

  onNameChange(event: any) {
    const newVal = event.target.value;
    // console.log(newVal);
  }
  getValue(name: string): any {
    return this.registerForm.get(name)?.value;
  }

  hideShowPassword() {
    this.isText = !this.isText;
    this.isText
      ? (this.eyeIcon = 'fa fa-eye')
      : (this.eyeIcon = 'fa fa-eye-slash');
    this.isText ? (this.type = 'text') : (this.type = 'password');
  }

  managerFieldDisable: boolean = true;

  onChangeRole() {
    // console.log(this.registerForm.value);
    var roleId = this.registerForm.get('roleId')?.value;
    // console.log('roleId => ', roleId);
    if (!roleId) {
      this.registerForm.get('managerId')?.disable();
    } else {
      this.registerForm.get('managerId')?.enable();
      this.fetchManagers();
    }
  }

  fetchGenders() {
    this.employeeService.getGenders().subscribe({
      next: (response: any) => {
        // console.log(response);
        this.gendersData = response.data;
        // console.log(this.gendersData);
      },
      error: (err) => {
        errorToast(err.error.errorMessages);
      },
    });
  }
  fetchRoles() {
    this.employeeService.getRoles().subscribe({
      next: (response: any) => {
        // console.log(response);
        this.roleData = response.data;
        this.roleData = this.roleData.filter(
          (role) => role.roleName != 'Admin'
        );
        // console.log(this.roleData);
      },
      error: (err) => {
        errorToast(err.error.errorMessages);
      },
    });
  }
  fetchEmployee() {
    this.employeeService
      .getEmployeesById(this.initialEmployeeData.id)
      .subscribe({
        next: (response: any) => {
          // console.log(response.data.roleId);
          this.initialEmployeeData = response.data;
          // this.initialEmployeeData.roleId = response.data.roleId;
          // console.log(this.initialEmployeeData.roleId);
          this.fetchManagers();
        },
        error: (err) => {
          errorToast(err.error.errorMessages);
        },
      });
  }
  fetchManagers() {
    var roleId = this.registerForm.get('roleId')?.value;
    this.employeeService.getManagers(roleId).subscribe({
      next: (response: any) => {
        // console.log(response);
        this.managerData = response.data;
        // console.log(this.managerData);
      },
      error: (err) => {
        errorToast(err.error.errorMessages);
      },
    });
  }
  fetchData() {
    if (this.initialEmployeeData.id !== 0) {
      this.fetchEmployee();
    }
    this.fetchGenders();
    this.fetchRoles();
  }
}
