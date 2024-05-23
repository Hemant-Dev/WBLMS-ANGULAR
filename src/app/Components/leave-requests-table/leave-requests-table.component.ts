import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { errorAlert, errorToast, showReason, successToast } from 'src/app/Helpers/swal';
import { LeaveRequestModel } from 'src/app/Models/leave-requestsModel';
import { LeaveStatusesCount } from 'src/app/Models/leave-statuses-count';
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
  pageNumber!: number;
  pageSize: number = 5;
  totalCount!: number;
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
  searchKeyword: string = '';
  leaveStatusesCount: LeaveStatusesCount = {
    approvedLeavesCount: 0,
    pendingLeavesCount: 0,
    rejectedLeavesCount: 0,
    leavesRemaining : 0
  };

  constructor(
    private leaveRequestService: LeaveRequestsService,
    private auth: AuthService,
    private userStore: UserStoreService,
    private router: Router
  ) { }
  leaveRequest = {
    name: '',
    phoneNumber: '',
  };
  lazyRequest = {
    first: 0,
    rows: this.pageSize,
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

    this.getLeaveStatusesData(Number(this.employeeId));
    // this.fetchAllRequestData();
    // this.fetchSelfRequestData();



  }
  getLeaveStatusesData(employeeId: number) {
    this.leaveRequestService.getLeaveStatusesCount(employeeId).subscribe({
      next: (res) => {
        this.leaveStatusesCount = res.data;
        this.leaveStatusesCount.leavesRemaining = 25 - (this.leaveStatusesCount.approvedLeavesCount + this.leaveStatusesCount.pendingLeavesCount);
        console.log(this.leaveStatusesCount)
      },
      error: (err) => console.log(err),
    });
  }
  // fetchAllRequestData() {
  //   if (this.role === 'Admin') {
  //     this.leaveRequestService
  //       .getLeaveRequests('', '', 1, 100, this.initialLeaveRequestObj)
  //       .subscribe({
  //         next: (res) => {
  //           this.selfLeaveRequests = res.data.dataArray;
  //           // console.log(res);
  //         },
  //         error: (err) => {
  //           errorAlert(`Status Code: ${err.StatusCode}` + err.ErrorMessages);
  //         },
  //       });
  //   }
  // }
  fetchSessionAndSelfRequestData() {
    this.fetchSessionData();
    // this.fetchSelfRequestData();
  }
  fetchSelfRequestData() {
    // debugger;
    // temp set then reset the id
    if (this.role !== 'Admin') {
      this.initialLeaveRequestObj.employeeId = Number(this.employeeId);
      this.leaveRequestService
        .getLeaveRequests(
          '',
          '',
          this.pageNumber,
          this.pageSize,
          this.initialLeaveRequestObj
        )
        .subscribe({
          next: (res) => {
            this.selfLeaveRequests = res.data.dataArray;
            this.totalCount = res.data.totalCount;
            this.initialLeaveRequestObj.employeeId = 0;
          },
          error: (err) => {
            console.log(err);
            // errorAlert(err);
            // errorAlert(`Status Code: ${err.StatusCode}` + err.ErrorMessages);
          },
        });
    }
  }
  getReason(reason: string) {
    showReason(reason)
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
    // console.log('search');
    // console.log(this.searchKeyword);
    this.leaveRequestService
      .searchLeaveRequests(
        1,
        100,
        this.searchKeyword,
        Number(this.employeeId),
        0
      )
      .subscribe({
        next: (res) => {
          this.selfLeaveRequests = res.data.dataArray;
          // console.log(this.selfLeaveRequests);
        },
        error: (err) => {
          errorAlert(err.ErrorMessages);
        },
      });
  }
  lazyLoadSelfRequestsData($event: TableLazyLoadEvent) {
    console.log($event);
    this.lazyRequest.first = $event.first || 0;
    this.pageNumber = this.lazyRequest.first / this.lazyRequest.rows + 1;
    this.lazyRequest.rows = $event.rows || 5;
    this.pageSize = this.lazyRequest.rows;
    this.fetchSelfRequestData();
  }
}
