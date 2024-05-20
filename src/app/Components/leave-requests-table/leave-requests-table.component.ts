import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { errorToast, successToast } from 'src/app/Helpers/swal';
import { LeaveRequestModel } from 'src/app/Models/leave-requestsModel';
import { UpdateRequestStatus } from 'src/app/Models/update-request-status';
import { AuthService } from 'src/app/Services/auth.service';
import { LeaveRequestsService } from 'src/app/Services/leave-requests.service';
import { UserStoreService } from 'src/app/Services/user-store.service';

@Component({
  selector: 'app-leave-requests-table',
  templateUrl: './leave-requests-table.component.html',
  styleUrls: ['./leave-requests-table.component.css'],
})
export class LeaveRequestsTableComponent implements OnInit {
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
  role!: string;
  fullName!: string;
  email!: string;
  employeeId!: string;
  constructor(
    private leaveRequestService: LeaveRequestsService,
    private auth: AuthService,
    private userStore: UserStoreService,
    private router: Router
  ) {}
  leaveRequest = {
    name: '',
    phoneNumber: ''
  };

  bootstrap : any;

  // submitLeaveRequest() {
  //   // Handle the form submission logic here
  //   console.log(this.leaveRequest);
  //   // You can reset the form and close the modal after submission
  //   this.leaveRequest = { name: '', phoneNumber: '' };
  // //   const modalElement = document.getElementById('addLeaveRequestModal');
  // //   const modalInstance = this.bootstrap.Modal.getInstance(modalElement);
  // //  // modalInstance.hide();
  // }
  submitLeaveRequest() {
    // Handle the form submission logic here
    console.log(this.leaveRequest);

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
    if (this.role !== 'Employee') {
      this.initialLeaveRequestObj.managerId = Number(this.employeeId);
      this.initialLeaveRequestObj.status = 'Pending';
      this.leaveRequestService
        .getLeaveRequests('', '', 1, 4, this.initialLeaveRequestObj)
        .subscribe({
          next: (res) => {
            console.log(res);
            this.leaveRequests = res.data.dataArray;
            this.initialLeaveRequestObj.managerId = 0;
            this.initialLeaveRequestObj.status = '';
            this.fetchSelfRequestData();
          },
          error: (err) => console.log(err),
        });
    }
  }

  fetchSelfRequestData() {
    // temp set then reset the id
    if (this.role !== 'Admin') {
      this.initialLeaveRequestObj.employeeId = Number(this.employeeId);
      this.leaveRequestService
        .getLeaveRequests('', '', 1, 4, this.initialLeaveRequestObj)
        .subscribe({
          next: (res) => {
            this.selfLeaveRequests = res.data.dataArray;
            this.initialLeaveRequestObj.employeeId = 0;
          },
          error: (err) => {
            console.log(err);
          },
        });
    }
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
}
