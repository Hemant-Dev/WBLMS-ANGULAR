import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { errorAlert } from 'src/app/Helpers/swal';
import { LeaveRequest } from 'src/app/Models/LeaveRequest';
import { LeaveRequestsService } from 'src/app/Services/leave-requests.service';

@Component({
  selector: 'app-leave-request',
  templateUrl: './leave-request.component.html',
  styleUrls: ['./leave-request.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(300)),
    ])
  ]
})
export class LeaveRequestComponent implements OnInit {
  leaveRequestForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private leaveRequestService: LeaveRequestsService
  ) { }

  leaveRequestData! : LeaveRequest[]

  ngOnInit(): void {
    this.fetchLeaveRequestData()
  }
  //       .createLeaveRequest(this.initialLeaveRequestData)
  //       .subscribe({
  //         next: (response: any) => {
  //           console.log(response)
  //         },
  //         error: (errorAlert) => {
  //           console.log(errorAlert)
  //         }
  //       })
  fetchLeaveRequestData()  {
    this.leaveRequestService.getLeaveRequest("firstName", "asc", 1, 5, this.initialLeaveRequestData)
    .subscribe({
      next : (response : any) => {
        console.log(response)
      },
      error : (error : any) => {
        console.log(error)
      }
    })
  }

  tableHeader =  [
    "Employee Name",
    "Leave Type",
    "Reason",
    "Status",
    "Start Date",
    "End Date",
    "Total Days",
    "Request Date",
    "Approved Date"
  ];

  
  initialLeaveRequestData: LeaveRequest = {
    id: 0,
    employeeId: 0,
    firstName : "",
    lastName : "", 
    managerId: 0, 
    leaveTypeId: 0,
    leaveType : "", 
    reason: 'Attending a family function', 
    status : "",
    startDate: this.formatDate('0001-01-01'), 
    endDate: this.formatDate('0001-01-01'), 
    numberOfLeaveDays: 1, 
    isHalfDay: false ,
    requestDate : this.formatDate('0001-01-01'),
    approvedDate : this.formatDate('0001-01-01')
  };

  formatDate(dateString: string | number | Date) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const year = date.getFullYear().toString().padStart(4, '0');
    return `${year}-${month}-${day}`;
  }

  // onSubmit(): void {
  //   console.log(this.initialLeaveRequestData)
  //   try {
  //     this.leaveRequestService
  //       .createLeaveRequest(this.initialLeaveRequestData)
  //       .subscribe({
  //         next: (response: any) => {
  //           console.log(response)
  //         },
  //         error: (errorAlert) => {
  //           console.log(errorAlert)
  //         }
  //       })
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
}
