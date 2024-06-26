import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { TableLazyLoadEvent } from 'primeng/table';
import { EncodeForms } from 'src/app/Helpers/encodeForms';
import { FetchSessionData } from 'src/app/Helpers/fetch-session-data';
import {
  errorAlert,
  errorToast,
  showReasonDisplayMessage,
} from 'src/app/Helpers/swal';
import { LeaveStatusModel } from 'src/app/Models/LeaveStatusModel';
import { LeaveTypeModel } from 'src/app/Models/LeaveTypeModel';
import { LeaveRequestModel } from 'src/app/Models/leave-requestsModel';
import { LeaveStatusesCount } from 'src/app/Models/leave-statuses-count';
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
  // List Of Requests
  selfLeaveRequests!: LeaveRequestModel[];

  // Lazy Loading Variables
  loading: boolean = true;
  pageNumber!: number;
  pageSize: number = 5;
  totalCount!: number;
  searchValue: string | undefined;
  submitStatus: boolean = false;
  searchKeyword: string = '';

  // Current User Session Details
  initialUserSessionObj: UserSessionModel = {
    employeeId: 0,
    fullName: '',
    email: '',
    role: '',
  };

  // Obj to filter data if required
  initialLeaveRequestObj: LeaveRequestModel = {
    id: 0,
    employeeId: 0,
    managerId: 0,
    firstName: '',
    lastName: '',
    leaveType: '',
    reason: '',
    status: '',
    numberOfLeaveDays: 0,
    startDate: '0001-01-01',
    endDate: '0001-01-01',
    requestDate: '0001-01-01',
  };

  leaveStatusesCount: LeaveStatusesCount = {
    approvedLeavesCount: 0,
    pendingLeavesCount: 0,
    rejectedLeavesCount: 0,
    leavesRemaining: 0,
  };
  // Obj to maintain var sent by the ng prime table
  lazyRequest = {
    first: 0,
    rows: 0,
    sortField: '',
    sortOrder: 1,
  };
  selectedFields!: string[];
  rangeDates: string[] | undefined;
  requestDateFilterField: string | undefined;
  tableHeaderObj: any[] = [
    { name: 'Reason', value: 'reason' },
    { name: 'Number of Days', value: 'numberOfLeaveDays' },
  ];
  leaveTypes: LeaveTypeModel[] = [];
  leaveStatuses: LeaveStatusModel[] = [];
  constructor(
    private leaveRequestService: LeaveRequestsService,
    private auth: AuthService,
    private userStore: UserStoreService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loading = true;
    // this.fetchSessionData();
    const sessionObj = new FetchSessionData(this.auth, this.userStore);
    sessionObj.fetchSessionData(this.initialUserSessionObj);
    this.getLeaveStatusesData(Number(this.initialUserSessionObj.employeeId));
    this.fetchLeaveTypes();
    this.fetchLeaveStatuses();
  }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  fetchLeaveTypes() {
    this.leaveRequestService.getLeaveType().subscribe({
      next: (res) => {
        // console.log(res);
        this.leaveTypes = res.data;
      },
      error: (err) => {
        errorToast(err.error.errorMessages);
      },
    });
  }

  fetchLeaveStatuses() {
    this.leaveRequestService.getLeaveStatuses().subscribe({
      next: (res) => {
        // console.log(res);
        this.leaveStatuses = res.data;
        // console.log(this.leaveStatuses);
      },
      error: (err) => {
        errorToast(err.error.errorMessages);
      },
    });
  }

  getLeaveStatusesData(employeeId: number) {
    this.leaveRequestService.getLeaveStatusesCount(employeeId).subscribe({
      next: (res) => {
        this.leaveStatusesCount = res.data;
        this.leaveStatusesCount.leavesRemaining =
          25 -
          (this.leaveStatusesCount.approvedLeavesCount +
            this.leaveStatusesCount.pendingLeavesCount);
      },

      error: (err) => errorToast(err.error.errorMessages),
    });
  }

  fetchSelfRequestData() {
    if (this.initialUserSessionObj.role !== 'Admin') {
      this.initialLeaveRequestObj.employeeId = Number(
        this.initialUserSessionObj.employeeId
      );
      // const searchWord = this.searchKeyword;
      // const EncodedSearchKeyword = EncodeForms.htmlEncode(searchWord);
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
            this.initialLeaveRequestObj.employeeId = 0;
            this.loading = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            // errorAlert(`Status Code: ${err.StatusCode}` + err.ErrorMessages);
            console.log(err);
            errorToast(err.error.errorMessages);
          },
        });
    }
  }
  getReason(reason: string) {
    showReasonDisplayMessage(reason);
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
  filterData() {
    // console.log(this.selectedFields);
    if (this.selectedFields) {
      this.selectedFields.forEach((header) => {
        if (header === 'reason')
          this.initialLeaveRequestObj.reason = EncodeForms.htmlEncode(
            this.searchKeyword
          );
        else if (
          header === 'numberOfLeaveDays' &&
          typeof Number(this.searchKeyword) === 'number' &&
          !isNaN(Number(this.searchKeyword))
        )
          this.initialLeaveRequestObj.numberOfLeaveDays = Number(
            this.searchKeyword
          );
        else return;
        this.searchKeyword = '';
      });
    } else {
      this.initialLeaveRequestObj.numberOfLeaveDays = 0;
    }
    // console.log(this.initialLeaveRequestObj);
    this.fetchSelfRequestData();
  }
  filterLeaveTypeData(event$: any) {
    this.initialLeaveRequestObj.leaveType = event$.value || '';
    this.filterData();
  }
  filterLeaveStatusData(event$: any) {
    this.initialLeaveRequestObj.status = event$.value || '';
    this.filterData();
  }
  filterDate() {
    // console.log(this.rangeDates);
    if (this.rangeDates !== undefined && this.rangeDates !== null) {
      this.initialLeaveRequestObj.startDate =
        this.rangeDates[0] || '0001-01-01';
      this.initialLeaveRequestObj.endDate = this.rangeDates[1] || '0001-01-01';
    } else {
      this.initialLeaveRequestObj.startDate = '0001-01-01';
      this.initialLeaveRequestObj.endDate = '0001-01-01';
    }
    this.fetchSelfRequestData();
  }
  handleClearAll() {
    this.initialLeaveRequestObj.leaveType = '';
    // console.log(this.initialLeaveRequestObj);
  }
  handleClearSelectedFields() {
    this.initialLeaveRequestObj.firstName = '';
    this.initialLeaveRequestObj.lastName = '';
    this.initialLeaveRequestObj.reason = '';
    this.selectedFields = [];
  }
  filterRequestDate() {
    if (
      this.requestDateFilterField !== undefined &&
      this.requestDateFilterField !== null
    ) {
      this.initialLeaveRequestObj.requestDate = this.requestDateFilterField;
    } else {
      this.initialLeaveRequestObj.requestDate = '0001-01-01';
    }
    // console.log(this.initialLeaveRequestObj.requestDate);
    this.fetchSelfRequestData();
  }
}
