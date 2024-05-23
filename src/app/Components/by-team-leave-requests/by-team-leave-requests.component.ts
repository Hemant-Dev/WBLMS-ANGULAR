import {
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterViewChecked,
} from '@angular/core';
import { TableLazyLoadEvent } from 'primeng/table';
import { errorAlert, errorToast, successToast } from 'src/app/Helpers/swal';
import { EmployeeModel } from 'src/app/Models/EmployeeModel';
import { LeaveRequestModel } from 'src/app/Models/leave-requestsModel';
import { UpdateRequestStatus } from 'src/app/Models/update-request-status';
import { ByRolesService } from 'src/app/Services/by-roles.service';
import { LeaveRequestsService } from 'src/app/Services/leave-requests.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-by-team-leave-requests',
  templateUrl: './by-team-leave-requests.component.html',
  styleUrls: ['./by-team-leave-requests.component.css'],
})
export class ByTeamLeaveRequestsComponent implements OnInit, AfterViewChecked {
  leaveRequests!: LeaveRequestModel[];
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
  };
  pageNumber!: number;
  pageSize: number = 5;
  totalCount!: number;
  searchKeyword: string = '';
  loading: boolean = true;
  lazyRequest = {
    first: 0,
    rows: 0,
    sortField: '',
    sortOrder: 1,
  };

  constructor(
    private byRolesService: ByRolesService,
    private leaveRequestService: LeaveRequestsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.byRolesService.data$.subscribe((val) => {
      const getRoleFromService = this.byRolesService.role;
      this.initialLeaveRequestObj.roleName = val || getRoleFromService;
    });
  }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  fetchByRoleLeaveRequestData() {
    this.initialLeaveRequestObj.status = 'Pending';
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
          this.leaveRequests = res.data.dataArray;
          this.totalCount = res.data.totalCount;
          this.cdr.detectChanges();
        },
        error: (err) => {
          errorAlert(`Status Code: ${err.StatusCode}` + err.ErrorMessages);
        },
      });
  }
  showReason(reason : string) {
    this.showReason(reason)
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
            error: (err) => errorToast('Error Occured while updating status'),
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
            error: (err) => errorToast('Error Occured while updating status'),
          });
      }
    });
  }

  handleSearch() {
    this.leaveRequestService
      .getLeaveRequestsByRoles(
        '',
        '',
        this.pageNumber,
        this.pageSize,
        this.initialLeaveRequestObj,
        this.searchKeyword
      )
      .subscribe({
        next: (res) => {
          this.leaveRequests = res.data.dataArray;
        },
        error: (err) => console.log(err),
      });
  }

  lazyLoadSelfRequestsData($event: TableLazyLoadEvent) {
    // console.log($event);
    this.lazyRequest.first = $event.first || 0;
    this.lazyRequest.rows = $event.rows || 5;
    this.lazyRequest.sortField = $event.sortField?.toString() || '';
    this.lazyRequest.sortOrder = $event.sortOrder || 1;
    this.pageNumber = this.lazyRequest.first / this.lazyRequest.rows;
    this.pageNumber++;
    this.pageSize = this.lazyRequest.rows;
    this.fetchByRoleLeaveRequestData();
  }
}
