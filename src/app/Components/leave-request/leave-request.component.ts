import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LeaveRequestModel } from 'src/app/Models/leave-requestsModel';
import { LeaveTypeModel } from 'src/app/Models/LeaveTypeModel';
import { AuthService } from 'src/app/Services/auth.service';
import { LeaveRequestsService } from 'src/app/Services/leave-requests.service';
import { UserStoreService } from 'src/app/Services/user-store.service';

@Component({
  selector: 'app-leave-request',
  templateUrl: './leave-request.component.html',
  styleUrls: ['./leave-request.component.css']
})
export class LeaveRequestComponent implements OnInit {
  updateLeaveDaysDebounced: any;
  ngOnInit(): void {
    this.getLeaveType();
    this.getDataFromUserStore()
  }

  constructor(
    private leaveRequestService: LeaveRequestsService,
    private userService: UserStoreService,
    private auth: AuthService
  ) { }

  //Todays date
  today = this.formatDate(new Date());

  initialLeaveRequestData: LeaveRequestModel = {
    id: 0,
    employeeId: 6,
    leaveTypeId: 0,
    reason: 'Attending a family function',
    startDate: this.today, 
    endDate: this.today, 
    numberOfLeaveDays: 1,
    isHalfDay: false,
  };

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().padStart(4, '0');
    return `${year}-${month}-${day}`;
  }

  todayDate: any = new Date();


  leaveTypeData!: LeaveTypeModel[];

  getLeaveType() {
    this.leaveRequestService
      .getLeaveType()
      .subscribe({
        next: (response: any) => {
          console.log(response)
          this.leaveTypeData = response.data;
          console.log(this.leaveTypeData)
        }
      })
  }
  

  calculateLeaveDays() {
    let start = new Date(this.initialLeaveRequestData.startDate!);
    let end = new Date(this.initialLeaveRequestData.endDate!);
    let count = 0;

    while (start <= end) {
      const dayOfWeek = start.getDay();
      console.log(dayOfWeek + " " + count)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { 
        count++;
      }
      start.setDate(start.getDate() + 1);
    }

    this.initialLeaveRequestData.numberOfLeaveDays = count;
  }


  getDataFromUserStore() {
    this.userService.getEmployeeIdFromStore()
      .subscribe((val) => {
        const employeeIdFromToken = this.auth.getEmployeeIdFromToken();
        const employeeId = val || employeeIdFromToken;
        this.initialLeaveRequestData.employeeId = employeeId;
      })
  }

  handleSubmit() {
    try {
      console.log(this.initialLeaveRequestData)
      this.leaveRequestService.createLeaveRequest(this.initialLeaveRequestData)
        .subscribe({
          next: (response: any) => {
            console.log(response)
          }
        });
    } catch (error) {
      console.log(error)
    }
  }
}
