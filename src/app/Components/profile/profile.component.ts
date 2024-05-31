import { HttpHeaderResponse, HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { FetchSessionData } from 'src/app/Helpers/fetch-session-data';
import { errorAlert, errorToast, successToast } from 'src/app/Helpers/swal';
import { EmployeeModel } from 'src/app/Models/EmployeeModel';
import { UserSessionModel } from 'src/app/Models/user-session-model';
import { AuthService } from 'src/app/Services/auth.service';
import { EmployeeRxjsService } from 'src/app/Services/employee-rxjs.service';
import { UserStoreService } from 'src/app/Services/user-store.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [MessageService],
})
export class ProfileComponent implements OnInit {
  employeeData: EmployeeModel = {
    id: 0,
    firstName: '',
    lastName: '',
    profilePic: '',
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
  selectedFile!: File;
  genderPicId: number = 3;
  constructor(
    private employeeService: EmployeeRxjsService,
    private userStore: UserStoreService,
    private auth: AuthService
  ) {}

  @ViewChild('fileUpload') fileUpload!: FileUpload;

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
  getEmployeeImage() {
    this.employeeService.getImageUrl(this.employeeData.id).subscribe({
      next: (res) => {
        console.log(res.data);
        this.employeeData.profilePic = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getEmployeeData() {
    this.employeeService
      .getEmployeesById(this.initialUserSessionObj.employeeId)
      .subscribe({
        next: (res) => {
          this.employeeData = res.data;
          this.setGenderId();
          this.getEmployeeImage();
        },
        error: (err) => {
          errorToast(err.error.errorMessages);
        },
      });
  }
  onUpload(event: any) {
    console.log(event.files[0]);
    this.selectedFile = event.files[0];
    if (this.selectedFile) {
      this.employeeService
        .uploadImage(event.files[0], this.employeeData.id)
        .subscribe({
          next: (res) => {
            console.log(res.errorMessages);
            successToast(res.errorMessages);
            this.getEmployeeData();
            this.fileUpload.clear();
            this.selectedFile = null!;
          },
          error: (err) => {
            console.log(err);
          },
        });
    }
  }
}
