import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TokenInterceptor } from 'src/app/Interceptors/token.interceptor';
import { EmployeeModel } from 'src/app/Models/EmployeeModel';
import { PaginatedModel } from 'src/app/Models/PaginatedModel';
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
  inititalEmployeeObj: EmployeeModel = {
    id: 0,
    firstName: '',
    lastName: '',
    password: '',
    emailAddress: '',
    contactNumber: '',
    genderId: 0,
    roleId: 0,
    managerId: 0,
    createdById: 0,
  };
  constructor(
    private auth: AuthService,
    private employeeService: EmployeeRxjsService,
    private userStore: UserStoreService
  ) {}
  ngOnInit(): void {
    // console.log(this.auth.getToken());
    this.fetchEmployeeData();
  }
  fetchEmployeeData() {
    if (
      this.auth.getRoleFromToken() === 'Admin' ||
      this.auth.getRoleFromToken() === 'HR' ||
      this.auth.getRoleFromToken() === 'Team Lead'
    ) {
      this.employeeService
        .getEmployees(1, 4, '', '', this.inititalEmployeeObj)
        .subscribe({
          next: (data) => {
            this.employees = data.data.dataArray;
            this.userStore.getFullNameFromStore().subscribe((val) => {
              const fullNameFromToken = this.auth.getFullNameFromToken();
              this.fullName = val || fullNameFromToken;
            });
            this.userStore.getRoleFromStore().subscribe((val) => {
              const roleFromToken = this.auth.getRoleFromToken();
              this.role = val || roleFromToken;
            });
            // console.log(data.data.dataArray);
          },
          error: (err) => console.log(err),
        });
    } else {
      console.log(`Unauthorized for current ${this.role}`);
    }
  }
}
