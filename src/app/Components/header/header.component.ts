import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import {
  dialogSwal,
  errorAlert,
  successAlert,
  successToast,
} from 'src/app/Helpers/swal';
import { UserSessionModel } from 'src/app/Models/user-session-model';
import { AuthService } from 'src/app/Services/auth.service';
import { UserStoreService } from 'src/app/Services/user-store.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  @Output() sideNavToggled: EventEmitter<boolean> = new EventEmitter<boolean>();
  menuStatus: boolean = false;
  constructor(
    private router: Router,
    private auth: AuthService,
    private userStore: UserStoreService
  ) {}
  ngOnInit(): void {
    // this.fetchSessionData();
  }

  SideNavToggled() {
    this.menuStatus = !this.menuStatus;
    this.sideNavToggled.emit(this.menuStatus);
  }
  // role!: string;
  // fullName!: string;
  // email!: string;
  // employeeId!: string;
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
  // fetchSessionData() {
  //   this.userStore.getFullNameFromStore().subscribe((val) => {
  //     const fullNameFromToken = this.auth.getFullNameFromToken();
  //     this.fullName = val || fullNameFromToken;
  //   });
  //   this.userStore.getRoleFromStore().subscribe((val) => {
  //     const roleFromToken = this.auth.getRoleFromToken();
  //     this.role = val || roleFromToken;
  //   });
  //   this.userStore.getEmailFromStore().subscribe((val) => {
  //     const emailFromToken = this.auth.getEmailFromToken();
  //     this.email = val || emailFromToken;
  //   });
  //   this.userStore.getEmployeeIdFromStore().subscribe((val) => {
  //     const employeeIdFromToken = this.auth.getEmployeeIdFromToken();
  //     this.employeeId = val || employeeIdFromToken;
  //   });
  // }
}
