import { Component, Input, OnInit } from '@angular/core';
import { errorToast } from 'src/app/Helpers/swal';
import { LeaveBalance } from 'src/app/Models/leave-balance';
import { LeaveStatusesCount } from 'src/app/Models/leave-statuses-count';
import { UserSessionModel } from 'src/app/Models/user-session-model';
import { LeaveRequestsService } from 'src/app/Services/leave-requests.service';
import { SharedServiceService } from 'src/app/Services/shared-service.service';

@Component({
  selector: 'app-leaves-remaining-dashboard',
  templateUrl: './leaves-remaining-dashboard.component.html',
  styleUrls: ['./leaves-remaining-dashboard.component.css'],
})
export class LeavesRemainingDashboardComponent implements OnInit {
  submitStatus: boolean = false;
  leaveBalance: LeaveBalance = {
    id: 0,
    employeeId: 0,
    balance: 0,
    totalLeaves: 0,
  };
  leaveStatusesCount: LeaveStatusesCount = {
    approvedLeavesCount: 0,
    pendingLeavesCount: 0,
    rejectedLeavesCount: 0,
  };
  leavesRemaining!: number;
  @Input() userSessionObj!: UserSessionModel;
  ngOnInit(): void {
    this.shared.data$.subscribe({
      next: (status) => {
        this.submitStatus = status;
        // console.log(status);
        if (
          this.userSessionObj.role !== 'Admin' &&
          this.userSessionObj.role !== ''
        ) {
          this.getLeaveBalanceByEmployeeId(this.userSessionObj.employeeId);
          this.getLeaveStatusesData(this.userSessionObj.employeeId);
        }
      },
      error: (err) => {
        errorToast(err.error.errorMessages);
      },
    });
    if (
      this.userSessionObj.role !== 'Admin' &&
      this.userSessionObj.role !== ''
    ) {
      this.getLeaveBalanceByEmployeeId(this.userSessionObj.employeeId);
      this.getLeaveStatusesData(this.userSessionObj.employeeId);
    }
  }

  constructor(
    private leaveRequestService: LeaveRequestsService,
    private shared: SharedServiceService
  ) {}
  getLeaveBalanceByEmployeeId(employeeId: number) {
    this.leaveRequestService.getLeavesBalances(employeeId).subscribe({
      next: (data: any) => {
        this.leaveBalance = data.data;
      },
      error: (err) => errorToast(err.error.errorMessages),
    });
  }
  getLeaveStatusesData(employeeId: number) {
    this.leaveRequestService.getLeaveStatusesCount(employeeId).subscribe({
      next: (res) => {
        // console.log(res.data);\
        this.leaveStatusesCount = res.data;
        this.leavesRemaining =
          this.leaveBalance.balance -
          this.leaveStatusesCount.pendingLeavesCount;
      },
      error: (err) => errorToast(err.error.errorMessages),
    });
  }
}
