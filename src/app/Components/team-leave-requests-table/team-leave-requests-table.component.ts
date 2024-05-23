import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TableLazyLoadEvent } from 'primeng/table';
import { successToast, errorToast, errorAlert } from 'src/app/Helpers/swal';
import { LeaveRequestModel } from 'src/app/Models/leave-requestsModel';
import { UpdateRequestStatus } from 'src/app/Models/update-request-status';
import { AuthService } from 'src/app/Services/auth.service';
import { LeaveRequestsService } from 'src/app/Services/leave-requests.service';
import { UserStoreService } from 'src/app/Services/user-store.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-team-leave-requests-table',
  templateUrl: './team-leave-requests-table.component.html',
  styleUrls: ['./team-leave-requests-table.component.css'],
})
export class TeamLeaveRequestsTableComponent implements OnInit {
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
  };
  role!: string;
  fullName!: string;
  email!: string;
  employeeId!: string;
  pageNumber!: number;
  pageSize: number = 5;
  totalCount!: number;
  searchKeyword: string = '';
  loading: boolean = true;
  activityValues: number[] = [0, 100];
  lazyRequest = {
    first: 0,
    rows: this.pageSize,
  };
  constructor(
    private leaveRequestService: LeaveRequestsService,
    private auth: AuthService,
    private userStore: UserStoreService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.fetchSessionData();
    // Fetching Team Leave requests data
    // this.fetchTeamLeaveRequests();
  }
  fetchTeamLeaveRequests() {
    if (this.role !== 'Employee') {
      this.initialLeaveRequestObj.managerId = Number(this.employeeId);
      this.initialLeaveRequestObj.status = 'Pending';
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
            // console.log(res);
            this.leaveRequests = res.data.dataArray;
            this.totalCount = res.data.totalCount;
            // console.log(this.leaveRequests);
            this.initialLeaveRequestObj.managerId = 0;
            this.initialLeaveRequestObj.status = '';
          },
          error: (err) => {
            // console.log(err);
            // errorAlert(err.data.errorMessage);
            errorAlert(`Status Code: ${err.StatusCode}` + err.ErrorMessages);
          },
        });
    }
  }
  handleRejectClick(Id: number) {
    Swal.fire({
      title: 'Do you want to reject the leave?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Yes',
      denyButtonText: `No`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
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
              this.ngOnInit();
            },
            error: (err) => errorToast('Error Occured while updating status'),
          });
      } else if (result.isDenied) {
        // Swal.fire('Changes are not saved', '', 'info');
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
      /* Read more about isConfirmed, isDenied below */
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
              this.ngOnInit();
            },
            error: (err) => errorToast('Error Occured while updating status'),
          });
      } else if (result.isDenied) {
        // Swal.fire('Changes are not saved', '', 'info');
      }
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

  handleSearch() {
    this.leaveRequestService
      .searchLeaveRequests(
        this.pageNumber,
        this.pageSize,
        this.searchKeyword,
        0,
        Number(this.employeeId)
      )
      .subscribe({
        next: (res) => {
          this.leaveRequests = res.data.dataArray;
          // console.log(this.leaveRequests);
        },
        error: (err) => {
          errorAlert(err.ErrorMessages);
        },
      });
  }
  lazyLoadSelfRequestsData($event: TableLazyLoadEvent) {
    // console.log($event);
    this.lazyRequest.first = $event.first || 0;
    this.pageNumber = this.lazyRequest.first / this.lazyRequest.rows;
    this.pageNumber++;
    this.lazyRequest.rows = $event.rows || 5;
    this.pageSize = this.lazyRequest.rows;
    this.fetchTeamLeaveRequests();
  }
}
