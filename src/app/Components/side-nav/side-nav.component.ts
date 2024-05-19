import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css'],
})
export class SideNavComponent {
  list = [
    {
      number: '1',
      name: 'Dashboard',
      icon: 'fa-solid fa-chart-pie',
      route: 'dashboard',
    },
    {
      number: '2',
      name: 'Profile',
      icon: 'fa-solid fa-user',
      route: 'profile',
    },
    {
      number: '3',
      name: 'Leave Requests',
      icon: 'fa-solid fa-calendar',
      route: 'leave-request',
    },
  ];
  @Input() sideNavStatus: boolean = false;
}
