import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  @Output() sideNavToggled: EventEmitter<boolean> = new EventEmitter<boolean>();
  menuStatus: boolean = false;

  constructor(private router: Router, private auth: AuthService) {}

  SideNavToggled() {
    this.menuStatus = !this.menuStatus;
    this.sideNavToggled.emit(this.menuStatus);
  }

  handleLogout() {
    this.auth.signout();
    alert('You have logged out successfully!');
  }
}
