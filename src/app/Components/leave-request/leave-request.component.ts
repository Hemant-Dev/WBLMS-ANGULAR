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
  ngOnInit(): void {
    this.getLeaveType();
    this.getDataFromUserStore()
    console.log(this.initialLeaveRequestData)
    console.log(this.userService.getFullNameFromStore.name)
  }


  constructor(
    private leaveRequestService: LeaveRequestsService,
    private userService : UserStoreService,
    private auth: AuthService
  ) { }

    initialLeaveRequestData: LeaveRequestModel = {
    id: 0,
    employeeId: 6,
    managerId: 3,
    leaveTypeId: 0,
    reason: 'Attending a family function',
    startDate: this.formatDate('0001-01-01'),
    endDate: this.formatDate('0001-01-01'),
    numberOfLeaveDays: 1,
    isHalfDay: false,
  };

  formatDate(dateString: string | number | Date) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().padStart(4, '0');
    return `${year}-${month}-${day}`;
  }

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

  getDataFromUserStore(){
    this.userService.getRoleFromStore().subscribe((val) => {
      const roleFromToken = this.auth.getRoleFromToken();
      const role = val || roleFromToken;
      console.log(role)
    });

    this.userService.getEmployeeIdFromStore()
    .subscribe((val) => {
      const employeeIdFromToken = this.auth.getEmployeeIdFromToken();
      const employeeId = val || employeeIdFromToken;
      this.initialLeaveRequestData.employeeId = employeeId;
    })

    this.userService.getManagerIdFromStore()
    .subscribe((val) => {
      const managerIdFromToken = this.auth.getManagerIdFromToken();
      const managerId = val || managerIdFromToken;
      this.initialLeaveRequestData.managerId = managerId;
      
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
