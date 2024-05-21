import { Component, Input, OnInit } from '@angular/core';
import { LeaveBalance } from 'src/app/Models/leave-balance';
import { LeaveStatusesCount } from 'src/app/Models/leave-statuses-count';
import { UserSessionModel } from 'src/app/Models/user-session-model';
import { LeaveRequestsService } from 'src/app/Services/leave-requests.service';

@Component({
  selector: 'app-leaves-remaining-dashboard',
  templateUrl: './leaves-remaining-dashboard.component.html',
  styleUrls: ['./leaves-remaining-dashboard.component.css'],
})
export class LeavesRemainingDashboardComponent implements OnInit {
  leaveBalance: LeaveBalance = {
    id: 0,
    employeeId: 0,
    balance: 0,
    totalLeaves: 0,
  };
  leaveStatusesCount!: LeaveStatusesCount;
  @Input() userSessionObj!: UserSessionModel;

  ngOnInit(): void {
    if (
      this.userSessionObj.role !== 'Admin' &&
      this.userSessionObj.role !== ''
    ) {
      this.getLeaveBalanceByEmployeeId(this.userSessionObj.employeeId);
      this.getLeaveStatusesData(this.userSessionObj.employeeId);
    }
  }
  constructor(private leaveRequestService: LeaveRequestsService) {}
  getLeaveBalanceByEmployeeId(employeeId: number) {
    this.leaveRequestService.getLeavesBalances(employeeId).subscribe({
      next: (data: any) => {
        this.leaveBalance = data.data;
      },
      error: (err) => console.log(err),
    });
  }
  getLeaveStatusesData(employeeId: number) {
    this.leaveRequestService.getLeaveStatusesCount(employeeId).subscribe({
      next: (data) => {
        console.log(data), (this.leaveStatusesCount = data.data);
      },
      error: (err) => console.log(err),
    });
  }
}
