import {
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterViewChecked,
} from '@angular/core';
import { TableLazyLoadEvent } from 'primeng/table';
import { EncodeForms } from 'src/app/Helpers/encodeForms';
import { FetchSessionData } from 'src/app/Helpers/fetch-session-data';
import {
  errorAlert,
  errorToast,
  showReasonDisplayMessage,
  successToast,
} from 'src/app/Helpers/swal';
import { LeaveTypeModel } from 'src/app/Models/LeaveTypeModel';
import { LeaveRequestModel } from 'src/app/Models/leave-requestsModel';
import { UpdateRequestStatus } from 'src/app/Models/update-request-status';
import { UserSessionModel } from 'src/app/Models/user-session-model';
import { AuthService } from 'src/app/Services/auth.service';
import { ByRolesService } from 'src/app/Services/by-roles.service';
import { LeaveRequestsService } from 'src/app/Services/leave-requests.service';
import { UserStoreService } from 'src/app/Services/user-store.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-by-team-leave-requests',
  templateUrl: './by-team-leave-requests.component.html',
  styleUrls: ['./by-team-leave-requests.component.css'],
})
export class ByTeamLeaveRequestsComponent implements OnInit, AfterViewChecked {
  // List Of Requests
  leaveRequests!: LeaveRequestModel[];
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
    roleName: '',
    startDate: '0001-01-01',
    endDate: '0001-01-01',
    requestDate: '0001-01-01',
  };
  // Lazy Loading Variables
  pageNumber!: number;
  pageSize: number = 5;
  totalCount!: number;
  searchKeyword: string = '';
  loading: boolean = true;
  // Obj to maintain var sent by the ng table
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
    { name: 'FirstName', value: 'firstName' },
    { name: 'LastName', value: 'lastName' },
    { name: 'Reason', value: 'reason' },
    { name: 'Number of Days', value: 'numberOfLeaveDays' },
  ];
  leaveTypes: LeaveTypeModel[] = [];
  constructor(
    private byRolesService: ByRolesService,
    private leaveRequestService: LeaveRequestsService,
    private userStore: UserStoreService,
    private auth: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loading = true;
    // this.fetchSessionData();
    const sessionObj = new FetchSessionData(this.auth, this.userStore);
    sessionObj.fetchSessionData(this.initialUserSessionObj);
    this.byRolesService.data$.subscribe((val) => {
      const getRoleFromService = this.byRolesService.role;
      this.initialLeaveRequestObj.roleName = val || getRoleFromService;
    });
    this.fetchLeaveTypes();
  }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }
  fetchLeaveTypes() {
    this.leaveRequestService.getLeaveType().subscribe({
      next: (res) => {
        this.leaveTypes = res.data;
      },
      error: (err) => {
        errorToast(err.error.errorMessages);
      },
    });
  }
  fetchByRoleLeaveRequestData() {
    // Only if a manager logs in other than admin
    if (
      this.initialUserSessionObj.role === 'HR Manager' ||
      this.initialUserSessionObj.role === 'Team Lead'
    ) {
      this.initialLeaveRequestObj.managerId = Number(
        this.initialUserSessionObj.employeeId
      );
      this.initialLeaveRequestObj.roleName = '';
    }
    this.initialLeaveRequestObj.status = 'Pending';
    // const EncodedSearchKeyword = EncodeForms.htmlEncode(this.searchKeyword);
    // console.log(this.searchKeyword, 'Encoded: ' + EncodedSearchKeyword);
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
        next: (res: any) => {
          // console.log(res);
          this.leaveRequests = res.data.dataArray;
          this.totalCount = res.data.totalCount;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          // errorAlert(`Status Code: ${err.StatusCode}` + err.ErrorMessages);
          errorToast(err.error.errorMessages);
        },
      });
  }

  showReason(reason: string) {
    showReasonDisplayMessage(reason);
  }

  handleRejectClick(Id: number) {
    Swal.fire({
      title: 'Do you want to reject the leave?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Yes',
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        const updateLeaveRequestStatus: UpdateRequestStatus = {
          id: Id,
          statusId: 3,
        };
        this.leaveRequestService
          .updateLeaveRequestStatus(Id, updateLeaveRequestStatus)
          .subscribe({
            next: (res) => {
              errorToast('Leave Request Rejected.');
              this.fetchByRoleLeaveRequestData();
            },
            error: (err) =>
              // errorAlert(`Status Code: ${err.StatusCode}` + err.ErrorMessages),
              errorToast(err.error.errorMessages),
          });
      }
    });
  }

  handleApproveClick(Id: number) {
    Swal.fire({
      title: 'Do you want to approve the leave?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Yes',
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        const updateLeaveRequestStatus: UpdateRequestStatus = {
          id: Id,
          statusId: 2,
        };
        this.leaveRequestService
          .updateLeaveRequestStatus(Id, updateLeaveRequestStatus)
          .subscribe({
            next: (res) => {
              successToast('Leave Request Approved.');
              this.fetchByRoleLeaveRequestData();
            },
            error: (err) =>
              // errorAlert(`Status Code: ${err.StatusCode}` + err.ErrorMessages),
              errorToast(err.error.errorMessages),
          });
      }
    });
  }

  lazyLoadSelfRequestsData($event: TableLazyLoadEvent) {
    this.loading = true;
    this.lazyRequest.first = $event.first || 0;
    this.lazyRequest.rows = $event.rows || 5;
    this.lazyRequest.sortField = $event.sortField?.toString() || '';
    this.lazyRequest.sortOrder = $event.sortOrder || 1;
    this.pageNumber = this.lazyRequest.first / this.lazyRequest.rows;
    this.pageNumber++;
    this.pageSize = this.lazyRequest.rows;
    setTimeout(() => {
      this.fetchByRoleLeaveRequestData();
    }, 1000);
  }

  filterData() {
    // console.log(this.selectedFields);
    if (this.selectedFields) {
      this.selectedFields.forEach((header) => {
        if (header === 'firstName')
          this.initialLeaveRequestObj.firstName = EncodeForms.htmlEncode(
            this.searchKeyword
          );
        else if (header === 'lastName')
          this.initialLeaveRequestObj.lastName = EncodeForms.htmlEncode(
            this.searchKeyword
          );
        else if (header === 'reason')
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
        // else this.searchKeyword = EncodeForms.htmlEncode(this.searchKeyword);
      });
    } else {
      this.initialLeaveRequestObj.firstName = '';
      this.initialLeaveRequestObj.lastName = '';
      this.initialLeaveRequestObj.reason = '';
      this.initialLeaveRequestObj.numberOfLeaveDays = 0;
    }
    // console.log(this.initialLeaveRequestObj);
    this.fetchByRoleLeaveRequestData();
  }
  filterLeaveTypeData(event$: any) {
    this.initialLeaveRequestObj.leaveType = event$.value || '';
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
    this.fetchByRoleLeaveRequestData();
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
    this.fetchByRoleLeaveRequestData();
  }
}
