import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import {
  errorAlert,
  errorToast,
  showReasonDisplayMessage,
  successToast,
} from 'src/app/Helpers/swal';
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
export class LeaveRequestsTableComponent implements OnInit, AfterViewChecked {
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
    leavesRemaining: 0,
  };

  constructor(
    private leaveRequestService: LeaveRequestsService,
    private auth: AuthService,
    private userStore: UserStoreService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}
  leaveRequest = {
    name: '',
    phoneNumber: '',
  };
  lazyRequest = {
    first: 0,
    rows: 0,
    sortField: '',
    sortOrder: 1,
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

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  getLeaveStatusesData(employeeId: number) {
    this.leaveRequestService.getLeaveStatusesCount(employeeId).subscribe({
      next: (res) => {
        this.leaveStatusesCount = res.data;
        this.leaveStatusesCount.leavesRemaining =
          25 -
          (this.leaveStatusesCount.approvedLeavesCount +
            this.leaveStatusesCount.pendingLeavesCount);
        // console.log(this.leaveStatusesCount);
      },
      error: (err) => console.log(err),
    });
  }

  fetchSessionAndSelfRequestData() {
    this.fetchSessionData();
    // this.fetchSelfRequestData();
  }
  fetchSelfRequestData() {
    if (this.role !== 'Admin') {
      this.initialLeaveRequestObj.employeeId = Number(this.employeeId);
      this.leaveRequestService
        .getLeaveRequests(
          this.lazyRequest.sortField,
          this.lazyRequest.sortOrder === 1 ? 'asc' : 'desc',
          this.pageNumber,
          this.pageSize,
          this.initialLeaveRequestObj
        )
        .subscribe({
          next: (res) => {
            this.selfLeaveRequests = res.data.dataArray;
            this.totalCount = res.data.totalCount;
            this.initialLeaveRequestObj.employeeId = 0;
            this.loading = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            // console.log(err);
            // errorAlert(err);
            errorAlert(`Status Code: ${err.StatusCode}` + err.ErrorMessages);
          },
        });
    }
  }
  getReason(reason: string) {
    showReasonDisplayMessage(reason);
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

  handleSearch() {
    this.leaveRequestService
      .getLeaveRequestsByRoles(
        this.lazyRequest.sortField,
        this.lazyRequest.sortOrder === 1 ? 'asc' : 'desc',
        this.pageNumber,
        this.pageSize,
        this.initialLeaveRequestObj,
        this.searchKeyword
      )
      .subscribe({
        next: (res) => {
          this.selfLeaveRequests = res.data.dataArray;
          this.totalCount = res.data.totalCount;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          errorAlert(`Status Code: ${err.StatusCode}` + err.ErrorMessages);
        },
      });
  }
  lazyLoadSelfRequestsData($event: TableLazyLoadEvent) {
    // console.log($event);
    this.loading = true;
    this.lazyRequest.first = $event.first || 0;
    this.lazyRequest.rows = $event.rows || 5;
    this.lazyRequest.sortField = $event.sortField?.toString() || '';
    this.lazyRequest.sortOrder = $event.sortOrder || 1;
    this.pageNumber = this.lazyRequest.first / this.lazyRequest.rows;
    this.pageNumber++;
    this.pageSize = this.lazyRequest.rows;
    setTimeout(() => {
      this.fetchSelfRequestData();
    }, 1000);
  }
}
