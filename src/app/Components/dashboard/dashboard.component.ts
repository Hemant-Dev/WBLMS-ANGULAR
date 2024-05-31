import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FetchSessionData } from 'src/app/Helpers/fetch-session-data';
import { UserSessionModel } from 'src/app/Models/user-session-model';
import { AuthService } from 'src/app/Services/auth.service';
import { ByRolesService } from 'src/app/Services/by-roles.service';
import { UserStoreService } from 'src/app/Services/user-store.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  initialUserSessionObj: UserSessionModel = {
    employeeId: 0,
    fullName: '',
    email: '',
    role: '',
  };

  constructor(
    private auth: AuthService,
    private userStore: UserStoreService,
    private byRolesService: ByRolesService,
    private router: Router
  ) {}
  ngOnInit(): void {
    const obj = new FetchSessionData(this.auth, this.userStore);
    obj.fetchSessionData(this.initialUserSessionObj);
    if (this.initialUserSessionObj.role === 'Admin') {
      this.router.navigate(['home/dashboard/hr-manager']);
    } else {
      this.router.navigate(['home/dashboard/leaveRequests']);
    }
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
