import { Component, Input, OnInit } from '@angular/core';
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
  role!: string;
  fullName!: string;
  email!: string;
  employeeId!: number;
  genderPicId : number = 3;
  constructor(
    private employeeService: EmployeeRxjsService,
    private userStore: UserStoreService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchSessionData();
    this.getEmployeeData();
    this.setGenderId()
  }

  setGenderId(){
    if(this.employeeData.genderName?.toLowerCase() === "female"){
      this.genderPicId = 2;
    }
  }

  getEmployeeData() {
    this.employeeService.getEmployeesById(this.employeeId).subscribe({
      next: (res) => {
        // console.log(res);
        this.employeeData = res.data;
        // console.log(this.employeeData);
      },
      error: (err) => {
        // console.log(err);
        errorAlert('Connection Error');
      },
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
