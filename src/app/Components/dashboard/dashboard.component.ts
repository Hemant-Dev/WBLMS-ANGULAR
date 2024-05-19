import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TokenInterceptor } from 'src/app/Interceptors/token.interceptor';
import { EmployeeModel } from 'src/app/Models/EmployeeModel';
import { PaginatedModel } from 'src/app/Models/PaginatedModel';
import { UserSessionModel } from 'src/app/Models/user-session-model';
import { AuthService } from 'src/app/Services/auth.service';
import { EmployeeRxjsService } from 'src/app/Services/employee-rxjs.service';
import { GetEmployeeAsync } from 'src/app/Services/employee.service';
import { UserStoreService } from 'src/app/Services/user-store.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  employees!: EmployeeModel[];
  role!: string;
  fullName!: string;
  email!: string;
  employeeId!: string;
  initialUserSessionObj: UserSessionModel = {
    employeeId: 0,
    fullName: '',
    email: '',
    role: '',
  };
  inititalEmployeeObj: EmployeeModel = {
    id: 0,
    firstName: '',
    lastName: '',
    password: '',
    emailAddress: '',
    contactNumber: '',
    genderId: 0,
    genderName: '',
    roleId: 0,
    roleName: '',
    managerId: 0,
    managerName: '',
    createdById: 0,
  };
  constructor(
    private auth: AuthService,
    private employeeService: EmployeeRxjsService,
    private userStore: UserStoreService
  ) {}
  ngOnInit(): void {
    // console.log(this.auth.getToken());
    // this.fetchEmployeeData();
    // if (
    //   this.auth.getRoleFromToken() === 'Admin' ||
    //   this.auth.getRoleFromToken() === 'HR' ||
    //   this.auth.getRoleFromToken() === 'Team Lead'
    // ) {
    //   this.fetchSessionData();
    // } else {
    //   console.log(`Unauthorized for current ${this.role}`);
    // }
    this.fetchSessionData();
    this.fetchEmployeeData()
  }
  fetchEmployeeData() {
    this.employeeService
      .getEmployees(1, 4, '', '', this.inititalEmployeeObj)
      .subscribe({
        next: (res) => {
          console.log(res.data.dataArray);
          this.employees = res.data.dataArray;
          console.log(this.employees);
        },
        error: (err) => console.log(err),
      });
  }

  fetchSessionData() {
    this.userStore.getFullNameFromStore().subscribe((val) => {
      const fullNameFromToken = this.auth.getFullNameFromToken();
      this.fullName = val || fullNameFromToken;
      this.initialUserSessionObj.fullName = this.fullName;
    });
    this.userStore.getRoleFromStore().subscribe((val) => {
      const roleFromToken = this.auth.getRoleFromToken();
      this.role = val || roleFromToken;
      this.initialUserSessionObj.role = this.role;
    });
    this.userStore.getEmailFromStore().subscribe((val) => {
      const emailFromToken = this.auth.getEmailFromToken();
      this.email = val || emailFromToken;
      this.initialUserSessionObj.email = this.email;
    });
    this.userStore.getEmployeeIdFromStore().subscribe((val) => {
      const employeeIdFromToken = this.auth.getEmployeeIdFromToken();
      this.employeeId = val || employeeIdFromToken;
      this.initialUserSessionObj.employeeId = Number(this.employeeId);
    });
  }
}
