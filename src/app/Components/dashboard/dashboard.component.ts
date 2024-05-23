import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { errorAlert } from 'src/app/Helpers/swal';
import { TokenInterceptor } from 'src/app/Interceptors/token.interceptor';
import { EmployeeModel } from 'src/app/Models/EmployeeModel';
import { PaginatedModel } from 'src/app/Models/PaginatedModel';
import { LeaveRequestModel } from 'src/app/Models/leave-requestsModel';
import { UserSessionModel } from 'src/app/Models/user-session-model';
import { AuthService } from 'src/app/Services/auth.service';
import { ByRolesService } from 'src/app/Services/by-roles.service';
import { EmployeeRxjsService } from 'src/app/Services/employee-rxjs.service';
import { GetEmployeeAsync } from 'src/app/Services/employee.service';
import { LeaveRequestsService } from 'src/app/Services/leave-requests.service';
import { UserStoreService } from 'src/app/Services/user-store.service';

type NewType = LeaveRequestModel;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
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
  seachKeyword: string = '';
  pageSize: number = 2;
  submitStatus: boolean = false;
  leaveRequests!: LeaveRequestModel[];
  selfLeaveRequests!: NewType[];
  loading: boolean = true;

  activityValues: number[] = [0, 100];

  searchValue: string | undefined;
  initialLeaveRequestObj: LeaveRequestModel = {
    id: 0,
    employeeId: 0,
    firstName: '',
    lastName: '',
    leaveType: '',
    reason: '',
    status: '',
    numberOfLeaveDays: 0,
  };
  constructor(
    private auth: AuthService,
    private userStore: UserStoreService,
    private leaveRequestService: LeaveRequestsService,
    private router: Router,
    private byRolesService: ByRolesService
  ) {}
  ngOnInit(): void {
    this.fetchSessionData();
    // this.fetchSelfRequestData();
    // this.fetchAllRequestData();
    if (this.role === 'Admin') {
      this.router.navigate(['home/dashboard/hr']);
    } else {
      this.router.navigate(['home/dashboard/leaveRequests']);
    }
    this.byRolesService.changeData('HR');
  }
  fetchSelfRequestData() {
    // temp set then reset the id
    if (this.role !== 'Admin') {
      this.initialLeaveRequestObj.employeeId = Number(this.employeeId);
      this.leaveRequestService
        .getLeaveRequests('', '', 1, 100, this.initialLeaveRequestObj)
        .subscribe({
          next: (res) => {
            this.selfLeaveRequests = res.data.dataArray;
            this.initialLeaveRequestObj.employeeId = 0;
          },
          error: (err) => {
            // console.log(err);
            errorAlert(err);
          },
        });
    }
  }
  fetchAllRequestData() {
    if (this.role === 'Admin') {
      this.leaveRequestService
        .getLeaveRequests('', '', 1, 100, this.initialLeaveRequestObj)
        .subscribe({
          next: (res) => {
            this.selfLeaveRequests = res.data.dataArray;
            // console.log(res);
          },
          error: (err) => console.log(err),
        });
    }
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
  handleHRLeaveRequestClick() {
    this.byRolesService.changeData('HR');
    this.byRolesService.saveData('HR');
  }
  handleTeamLeadLeaveRequestClick() {
    this.byRolesService.changeData('Team Lead');
    this.byRolesService.saveData('Team Lead');
  }
  handleEmployeeLeaveRequestClick() {
    this.byRolesService.changeData('Employee');
    this.byRolesService.saveData('Employee');
  }
}
