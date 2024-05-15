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
      name: 'Home',
      icon: 'fa-solid fa-house',
      route: 'home',
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
      route: 'leaveRequests',
    },
  ];
  @Input() sideNavStatus: boolean = false;

  constructor(private router: Router) {}
  handleNavmenuClick(route: string) {
    this.router.navigate([route]);
  }
}
