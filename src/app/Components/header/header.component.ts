import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import {
  dialogSwal,
  errorAlert,
  successAlert,
  successToast,
} from 'src/app/Helpers/swal';
import { AuthService } from 'src/app/Services/auth.service';
import Swal from 'sweetalert2';

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
    Swal.fire({
      title: 'Do you want to log out?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Yes',
      denyButtonText: `No`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        // Swal.fire('Saved!', '', 'success');
        this.auth.signout();
        successToast('You have logged out successfully!');
      } else if (result.isDenied) {
        // Swal.fire('Changes are not saved', '', 'info');
      }
    });
  }
}
