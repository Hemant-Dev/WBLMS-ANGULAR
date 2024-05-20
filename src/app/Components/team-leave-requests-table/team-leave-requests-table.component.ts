import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { successToast, errorToast, errorAlert } from 'src/app/Helpers/swal';
import { LeaveRequestModel } from 'src/app/Models/leave-requestsModel';
import { UpdateRequestStatus } from 'src/app/Models/update-request-status';
import { AuthService } from 'src/app/Services/auth.service';
import { LeaveRequestsService } from 'src/app/Services/leave-requests.service';
import { UserStoreService } from 'src/app/Services/user-store.service';

@Component({
  selector: 'app-team-leave-requests-table',
  templateUrl: './team-leave-requests-table.component.html',
  styleUrls: ['./team-leave-requests-table.component.css'],
})
export class TeamLeaveRequestsTableComponent implements OnInit {
  leaveRequests!: LeaveRequestModel[];
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
  ngOnInit(): void {
    this.fetchSessionData();
    // Fetching Employee requests data
    if (this.role !== 'Employee') {
      this.initialLeaveRequestObj.managerId = Number(this.employeeId);
      this.initialLeaveRequestObj.status = 'Pending';
      this.leaveRequestService
        .getLeaveRequests('', '', 1, 100, this.initialLeaveRequestObj)
        .subscribe({
          next: (res) => {
            // console.log(res);
            this.leaveRequests = res.data.dataArray;
            this.initialLeaveRequestObj.managerId = 0;
            this.initialLeaveRequestObj.status = '';
          },
          error: (err) => {
            // console.log(err);
            errorAlert(err.data.errorMessage);
          },
        });
    }
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
          this.ngOnInit();
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
          this.ngOnInit();
        },
        error: (err) => errorToast('Error Occured while updating status'),
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
