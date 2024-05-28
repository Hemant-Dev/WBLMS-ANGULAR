import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';
import { UserStoreService } from 'src/app/Services/user-store.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css'],
})
export class SideNavComponent implements OnInit {
  role!: string;
  fullName!: string;
  email!: string;
  employeeId!: string;
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
      route: 'dashboard/hr',
      role: ['Admin'],
    },
    {
      number: '3',
      name: 'Profile',
      icon: 'fa-solid fa-user',
      route: 'profile',
      role: ['Developer', 'HR', 'Team Lead', 'HR Manager'],
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
      icon: 'fa-solid fa-user-plus',
      route: 'showAllEmployees',
      role: ['Admin'],
    },
  ];
  filteredList: any[] = [];
  @Input() sideNavStatus: boolean = false;
  constructor(
    private auth: AuthService,
    private userStore: UserStoreService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.fetchSessionData();
    this.filteredList = this.list.filter((item) => {
      return item.role.includes(this.role);
    });
  }
  fetchSessionData() {
    this.userStore.getFullNameFromStore().subscribe((val) => {
      const fullNameFromToken = this.auth.getFullNameFromToken();
      this.fullName = val || fullNameFromToken;
    });
    this.userStore.getRoleFromStore().subscribe((val) => {
      const roleFromToken = this.auth.getRoleFromToken();
      this.role = val || roleFromToken;
    });
    this.userStore.getEmailFromStore().subscribe((val) => {
      const emailFromToken = this.auth.getEmailFromToken();
      this.email = val || emailFromToken;
    });
    this.userStore.getEmployeeIdFromStore().subscribe((val) => {
      const employeeIdFromToken = this.auth.getEmployeeIdFromToken();
      this.employeeId = val || employeeIdFromToken;
    });
  }
}
