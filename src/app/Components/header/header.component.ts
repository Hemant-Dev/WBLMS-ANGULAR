import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FetchSessionData } from 'src/app/Helpers/fetch-session-data';
import { successToast } from 'src/app/Helpers/swal';
import { UserSessionModel } from 'src/app/Models/user-session-model';
import { AuthService } from 'src/app/Services/auth.service';
import { EmployeeRxjsService } from 'src/app/Services/employee-rxjs.service';
import { SharedServiceService } from 'src/app/Services/shared-service.service';
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
  profilePic = '';
  constructor(
    private auth: AuthService,
    private userStore: UserStoreService,
    private employeeService: EmployeeRxjsService,
    private sharedService: SharedServiceService
  ) {}
  ngOnInit(): void {
    // this.fetchSessionData();
    const sessionObj = new FetchSessionData(this.auth, this.userStore);
    sessionObj.fetchSessionData(this.initialUserSessionObj);
    // console.log(this.initialUserSessionObj);
    this.getEmployeeImage();
    this.sharedService.profile$.subscribe({
      next: (res) => {
        if (res) {
          // console.log('Profile Pic Changed');
          this.getEmployeeImage();
        }
      },
    });
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
  getEmployeeImage() {
    this.employeeService
      .getImageUrl(this.initialUserSessionObj.employeeId)
      .subscribe({
        next: (res) => {
          // console.log(res.data);
          this.profilePic = res.data;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
}
