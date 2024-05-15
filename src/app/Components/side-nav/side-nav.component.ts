import { Component, Input } from '@angular/core';

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
    },
    {
      number: '2',
      name: 'Profile',
      icon: 'fa-solid fa-user',
    },
    {
      number: '3',
      name: 'Leave Requests',
      icon: 'fa-solid fa-calendar',
    },
    {
      number: '1',
      name: 'Dashboard',
      icon: 'fa-solid fa-list-check',
    },
  ];
  @Input() sideNavStatus: boolean = false;
}
