import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { errorAlert, errorToast, successToast } from 'src/app/Helpers/swal';
import { LeaveRequestModel } from 'src/app/Models/leave-requestsModel';
import { UpdateRequestStatus } from 'src/app/Models/update-request-status';
import { UserSessionModel } from 'src/app/Models/user-session-model';
import { AuthService } from 'src/app/Services/auth.service';
import { LeaveRequestsService } from 'src/app/Services/leave-requests.service';
import { UserStoreService } from 'src/app/Services/user-store.service';

@Component({
  selector: 'app-leave-requests-table',
  templateUrl: './leave-requests-table.component.html',
  styleUrls: ['./leave-requests-table.component.css'],
})
export class LeaveRequestsTableComponent implements OnInit {
  submitStatus: boolean = false;
  leaveRequests!: LeaveRequestModel[];
  selfLeaveRequests!: LeaveRequestModel[];
  loading: boolean = true;

  activityValues: number[] = [0, 100];

  searchValue: string | undefined;
  initialLeaveRequestObj: LeaveRequestModel = {
    id: 0,
    employeeId: 0,
    firstName: '',
    lastName: '',
    leaveType: '',
    reason: '',
    status: '',
    numberOfLeaveDays: 0,
  };
  initialUserSessionObj: UserSessionModel = {
    employeeId: 0,
    fullName: '',
    email: '',
    role: '',
  };
  role!: string;
  fullName!: string;
  email!: string;
  employeeId!: string;
  seachKeyword: string = '';

  pageSize: number = 2;

  constructor(
    private leaveRequestService: LeaveRequestsService,
    private auth: AuthService,
    private userStore: UserStoreService,
    private router: Router
  ) {}
  leaveRequest = {
    name: '',
    phoneNumber: '',
  };

  bootstrap: any;

  submitLeaveRequest() {
    // You can reset the form and close the modal after submission
    this.leaveRequest = { name: '', phoneNumber: '' };

    // Close the modal using Bootstrap's data attributes
    const modalElement = document.getElementById('addLeaveRequestModal');
    if (modalElement) {
      const modalInstance = new this.bootstrap.Modal(modalElement);
      modalInstance.hide();
    }
  }

  ngOnInit() {
    this.fetchSessionData();
    this.fetchAllRequestData();
    this.fetchSelfRequestData();
  }
  fetchAllRequestData() {
    if (this.role === 'Admin') {
      this.leaveRequestService
        .getLeaveRequests('', '', 1, 100, this.initialLeaveRequestObj)
        .subscribe({
          next: (res) => {
            this.selfLeaveRequests = res.data.dataArray;
            console.log(res);
          },
          error: (err) => console.log(err),
        });
    }
  }
  fetchSessionAndSelfRequestData() {
    this.fetchSessionData();
    this.fetchSelfRequestData();
  }
  fetchSelfRequestData() {
    // temp set then reset the id
    if (this.role !== 'Admin') {
      this.initialLeaveRequestObj.employeeId = Number(this.employeeId);
      this.leaveRequestService
        .getLeaveRequests('', '', 1, 100, this.initialLeaveRequestObj)
        .subscribe({
          next: (res) => {
            this.selfLeaveRequests = res.data.dataArray;
            this.initialLeaveRequestObj.employeeId = 0;
          },
          error: (err) => {
            // console.log(err);
            errorAlert(err);
          },
        });
    }
  }
  fetchSessionData() {
    this.userStore.getFullNameFromStore().subscribe((val) => {
      const fullNameFromToken = this.auth.getFullNameFromToken();
      this.fullName = val || fullNameFromToken;
      this.initialUserSessionObj.fullName = this.fullName;
    });
    this.userStore.getRoleFromStore().subscribe((val) => {
      const roleFromToken = this.auth.getRoleFromToken();
      this.role = val || roleFromToken;
      this.initialUserSessionObj.role = this.role;
    });
    this.userStore.getEmailFromStore().subscribe((val) => {
      const emailFromToken = this.auth.getEmailFromToken();
      this.email = val || emailFromToken;
      this.initialUserSessionObj.email = this.email;
    });
    this.userStore.getEmployeeIdFromStore().subscribe((val) => {
      const employeeIdFromToken = this.auth.getEmployeeIdFromToken();
      this.employeeId = val || employeeIdFromToken;
      this.initialUserSessionObj.employeeId = Number(this.employeeId);
    });
  }
  clear(table: Table) {
    table.clear();
    this.searchValue = '';
  }
  handleRejectClick(Id: number) {
    const updateLeaveRequestStatus: UpdateRequestStatus = {
      id: Id,
      statusId: 3,
    };
    this.leaveRequestService
      .updateLeaveRequestStatus(Id, updateLeaveRequestStatus)
      .subscribe({
        next: (res) => {
          successToast('Leave Request Rejected.');
          this.fetchSelfRequestData();
        },
        error: (err) => errorToast('Error Occured while updating status'),
      });
  }

  handleApproveClick(Id: number) {
    const updateLeaveRequestStatus: UpdateRequestStatus = {
      id: Id,
      statusId: 2,
    };
    this.leaveRequestService
      .updateLeaveRequestStatus(Id, updateLeaveRequestStatus)
      .subscribe({
        next: (res) => {
          successToast('Leave Request Approved.');
          this.fetchSelfRequestData();
        },
        error: (err) => errorToast('Error Occured while updating status'),
      });
  }

  handleSearch() {
    console.log('search');
    console.log(this.seachKeyword);
    this.leaveRequestService
    .searchLeaveRequests(1, 100, this.seachKeyword, Number(this.employeeId),0)
    .subscribe({
      next : (res) => {
        this.selfLeaveRequests = res.data.dataArray;
        console.log(this.selfLeaveRequests)
      }
    })
      .searchLeaveRequests(
        1,
        this.pageSize,
        this.seachKeyword,
        Number(this.employeeId)
      )
      .subscribe({
        next: (res) => {
          this.selfLeaveRequests = res.data.dataArray;
          console.log(this.selfLeaveRequests);
        },
      });
  }
}
