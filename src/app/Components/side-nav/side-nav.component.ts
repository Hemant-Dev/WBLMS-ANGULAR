import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FetchSessionData } from 'src/app/Helpers/fetch-session-data';
import { UserSessionModel } from 'src/app/Models/user-session-model';
import { AuthService } from 'src/app/Services/auth.service';
import { UserStoreService } from 'src/app/Services/user-store.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css'],
})
export class SideNavComponent implements OnInit {
  initialUserSessionObj: UserSessionModel = {
    employeeId: 0,
    fullName: '',
    email: '',
    role: '',
  };
  list = [
    {
      number: '1',
      name: 'Dashboard',
      icon: 'fa-solid fa-chart-pie',
      route: 'dashboard/leaveRequests',
      role: ['Developer', 'HR', 'Team Lead', 'HR Manager'],
    },
    {
      number: '2',
      name: 'Dashboard',
      icon: 'fa-solid fa-chart-pie',
      route: 'dashboard/hr-manager',
      role: ['Admin'],
    },
    {
      number: '3',
      name: 'Profile',
      icon: 'fa-solid fa-user',
      route: 'profile',
      role: ['Developer', 'HR', 'Team Lead', 'HR Manager', 'Admin'],
    },
    {
      number: '4',
      name: 'Register Employee',
      icon: 'fa-solid fa-user-plus',
      route: 'register',
      role: ['Admin'],
    },
    {
      number: '5',
      name: 'See All Employees',
      icon: 'fa-solid fa-users',
      route: 'showAllEmployees',
      role: ['Admin'],
    },
  ];
  filteredList: any[] = [];
  @Input() sideNavStatus: boolean = false;
  constructor(private auth: AuthService, private userStore: UserStoreService) {}
  ngOnInit(): void {
    // this.fetchSessionData();
    const sessionObj = new FetchSessionData(this.auth, this.userStore);
    sessionObj.fetchSessionData(this.initialUserSessionObj);
    this.filteredList = this.list.filter((item) => {
      return item.role.includes(this.initialUserSessionObj.role);
    });
  }
}
