import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { errorAlert } from 'src/app/Helpers/swal';
import { LeaveRequestModel } from 'src/app/Models/leave-requestsModel';
import { UserSessionModel } from 'src/app/Models/user-session-model';
import { AuthService } from 'src/app/Services/auth.service';
import { ByRolesService } from 'src/app/Services/by-roles.service';
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
  data: any;

  options: any;
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
    private router: Router,
    private byRolesService: ByRolesService
  ) {}
  ngOnInit(): void {
    this.fetchSessionData();
    if (this.role === 'Admin') {
      this.router.navigate(['home/dashboard/hr']);
    } else {
      this.router.navigate(['home/dashboard/leaveRequests']);
    }
    this.byRolesService.changeData('HR');
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

  handleHRManagerLeaveRequestClick() {
    this.byRolesService.changeData('HR Manager');
    this.byRolesService.saveData('HR Manager');
  }
  handleTeamLeadLeaveRequestClick() {
    this.byRolesService.changeData('Team Lead');
    this.byRolesService.saveData('Team Lead');
  }
  handleDeveloperLeaveRequestClick() {
    this.byRolesService.changeData('Developer');
    this.byRolesService.saveData('Developer');
  }
  handleHRLeaveRequestClick() {
    this.byRolesService.changeData('HR');
    this.byRolesService.saveData('HR');
  }
}
