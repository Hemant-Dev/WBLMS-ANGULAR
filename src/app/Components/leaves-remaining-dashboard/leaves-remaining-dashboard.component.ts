import { Component, Input, OnInit } from '@angular/core';
import { LeaveBalance } from 'src/app/Models/leave-balance';
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

  @Input() employeeId!: number;
  ngOnInit(): void {
    this.getLeaveBalanceByEmployeeId(6);
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
}
