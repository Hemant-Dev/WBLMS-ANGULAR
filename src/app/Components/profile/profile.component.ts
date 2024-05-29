import { Component, Input, OnInit } from '@angular/core';
import { FetchSessionData } from 'src/app/Helpers/fetch-session-data';
import { errorAlert } from 'src/app/Helpers/swal';
import { EmployeeModel } from 'src/app/Models/EmployeeModel';
import { UserSessionModel } from 'src/app/Models/user-session-model';
import { AuthService } from 'src/app/Services/auth.service';
import { EmployeeRxjsService } from 'src/app/Services/employee-rxjs.service';
import { UserStoreService } from 'src/app/Services/user-store.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  employeeData: EmployeeModel = {
    id: 0,
    firstName: '',
    lastName: '',
    emailAddress: '',
    contactNumber: '',
    genderName: '',
    roleName: '',
    managerName: '',
    roleId: 0,
  };
  initialUserSessionObj: UserSessionModel = {
    employeeId: 0,
    fullName: '',
    email: '',
    role: '',
  };
  genderPicId: number = 3;

  constructor(
    private employeeService: EmployeeRxjsService,
    private userStore: UserStoreService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    // this.fetchSessionData();
    const sessionObj = new FetchSessionData(this.auth, this.userStore);
    sessionObj.fetchSessionData(this.initialUserSessionObj);
    this.getEmployeeData();
  }

  setGenderId() {
    if (this.employeeData.genderName?.toLowerCase() === 'female') {
      this.genderPicId = 2;
    }
  }

  getEmployeeData() {
    this.employeeService
      .getEmployeesById(this.initialUserSessionObj.employeeId)
      .subscribe({
        next: (res) => {
          this.employeeData = res.data;
          this.setGenderId();
        },
        error: (err) => {
          errorAlert('Connection Error');
        },
      });
  }
}
