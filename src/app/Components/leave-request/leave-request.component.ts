import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { errorAlert, errorToast, successToast } from 'src/app/Helpers/swal';
import { LeaveRequestModel } from 'src/app/Models/leave-requestsModel';
import { LeaveTypeModel } from 'src/app/Models/LeaveTypeModel';
import { AuthService } from 'src/app/Services/auth.service';
import { LeaveRequestsService } from 'src/app/Services/leave-requests.service';
import { SharedServiceService } from 'src/app/Services/shared-service.service';
import { UserStoreService } from 'src/app/Services/user-store.service';

@Component({
  selector: 'app-leave-request',
  templateUrl: './leave-request.component.html',
  styleUrls: ['./leave-request.component.css'],
})
export class LeaveRequestComponent implements OnInit {
  updateLeaveDaysDebounced: any;
  @Output() submitLeaveRequestClicked: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  submitStatus: boolean = false;

  ngOnInit(): void {
    // console.log('fetch data');
    this.getLeaveType();
    this.getDataFromUserStore();
    // this.fetchHolidayData();
  }

  constructor(
    private leaveRequestService: LeaveRequestsService,
    private userService: UserStoreService,
    private auth: AuthService,
    private router: Router,
    private service: SharedServiceService
  ) {}
  submitButtonClicked() {
    this.submitStatus = !this.submitStatus;
    this.submitLeaveRequestClicked.emit(this.submitStatus);
  }
  //Todays date
  today = this.formatDate(new Date());

  initialLeaveRequestData: LeaveRequestModel = {
    id: 0,
    employeeId: 0,
    leaveTypeId: 0,
    reason: '',
    startDate: '',
    endDate: '',
    numberOfLeaveDays: 0,
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
    this.leaveRequestService.getLeaveType().subscribe({
      next: (response: any) => {
        // console.log(response);
        this.leaveTypeData = response.data;
        // console.log(this.leaveTypeData);
      },
    });
  }

  fetchHolidayData() {
    this.leaveRequestService.getWonderbizholidays().subscribe({
      next: (response: any) => {
        console.log(response);
      },
    });
  }

  calculateLeaveDays() {
    let start = new Date(this.initialLeaveRequestData.startDate!);
    let end = new Date(this.initialLeaveRequestData.endDate!);
    let count = 0;

    while (start <= end) {
      const dayOfWeek = start.getDay();
      // console.log(dayOfWeek + ' ' + count);
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        count++;
      }
      start.setDate(start.getDate() + 1);
    }
    if (start === end && this.initialLeaveRequestData.isHalfDay) {
      count = 0.5;
    }
    // console.log(this.initialLeaveRequestData);
    this.initialLeaveRequestData.numberOfLeaveDays = count;
  }

  halfDay() {
    if (this.initialLeaveRequestData.isHalfDay)
      this.initialLeaveRequestData.numberOfLeaveDays = 0.5;
    else {
      this.calculateLeaveDays();
    }
  }

  getDataFromUserStore() {
    this.userService.getEmployeeIdFromStore().subscribe((val) => {
      const employeeIdFromToken = this.auth.getEmployeeIdFromToken();
      const employeeId = val || employeeIdFromToken;
      this.initialLeaveRequestData.employeeId = employeeId;
    });
  }

  handleSubmit() {
    this.leaveRequestService
      .createLeaveRequest(this.initialLeaveRequestData)
      .subscribe({
        next: (res) => {
          // console.log(res);
          successToast('Leave request created successfully!');
          const buttonRef = document.getElementById('closeBtn');
          buttonRef?.click();
          this.submitStatus = true;
          this.submitButtonClicked();
          this.service.changeData(true);
          this.initialLeaveRequestData = {
            id: 0,
            employeeId: 0,
            leaveTypeId: 0,
            reason: '',
            startDate: '',
            endDate: '',
            numberOfLeaveDays: 0,
            isHalfDay: false,
          };
          this.ngOnInit();

          // this.router.navigate(['home/leaveRequests']);
          // this.router.navigate([this.router.url]);
        },
        error: (err) =>
          errorToast('Something went wrong while creating Leave Requests!'),
      });
  }
}
