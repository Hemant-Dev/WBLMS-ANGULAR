import { Component, OnInit } from '@angular/core';
import { LeaveRequestModel } from 'src/app/Models/leave-requestsModel';
import { LeaveTypeModel } from 'src/app/Models/LeaveTypeModel';
import { LeaveRequestsService } from 'src/app/Services/leave-requests.service';

@Component({
  selector: 'app-leave-request',
  templateUrl: './leave-request.component.html',
  styleUrls: ['./leave-request.component.css']
})
export class LeaveRequestComponent implements OnInit {
  ngOnInit(): void {
    this.getLeaveType();
  }

  // initialLeaveRequestData : LeaveRequestModel = {
  //   id: 0,
  //   employeeId: 0,
  //   leaveType: '',
  //   reason: '',
  //   startDate : ,
  //   endDate : ,
  //   numberOfLeaveDays: ,
  //   isHalfDay : false,

  // }
  constructor(
    private leaveRequestService : LeaveRequestsService
  ){}


  leaveTypeData! : LeaveTypeModel[];

  getLeaveType(){
    this.leaveRequestService
    .getLeaveType()
    .subscribe({
      next : (response : any) => {
        console.log(response)
        this.leaveTypeData = response.data;
        console.log(this.leaveTypeData)
      }
    })
  }

  handleSubmit() {
    console.log()
  }

}
