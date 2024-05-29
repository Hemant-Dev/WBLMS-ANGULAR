import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FetchSessionData } from 'src/app/Helpers/fetch-session-data';
import { successToast } from 'src/app/Helpers/swal';
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
  initialUserSessionObj: UserSessionModel = {
    employeeId: 0,
    fullName: '',
    email: '',
    role: '',
  };
  constructor(private auth: AuthService, private userStore: UserStoreService) {}
  ngOnInit(): void {
    // this.fetchSessionData();
    const sessionObj = new FetchSessionData(this.auth, this.userStore);
    sessionObj.fetchSessionData(this.initialUserSessionObj);
  }

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
      if (result.isConfirmed) {
        this.auth.signout();
        successToast('You have logged out successfully!');
      } else if (result.isDenied) {
      }
    });
  }
}
