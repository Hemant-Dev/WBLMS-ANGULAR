import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { errorAlert, errorToast, successToast } from 'src/app/Helpers/swal';
import ValidateForm from 'src/app/Helpers/validateform';
import { LeaveRequestModel } from 'src/app/Models/leave-requestsModel';
import { LeaveTypeModel } from 'src/app/Models/LeaveTypeModel';
import { WonderbizHolidaysModel } from 'src/app/Models/WonderbizHolidays';
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

  leaveRequestForm!: FormGroup;
  wonderbizHolidays!: WonderbizHolidaysModel[];

  ngOnInit(): void {
    // console.log('fetch data');
    this.getLeaveType();
    this.getDataFromUserStore();

    this.leaveRequestForm = this.fb.group({
      id: 0,
      employeeId: [0, Validators.required],
      leaveTypeId: [0, Validators.required],
      reason: ['', [Validators.required, Validators.maxLength(100)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      numberOfLeaveDays: new FormControl({ value: 0, disabled: true }, Validators.required),
      isHalfDay: [false, Validators.required],
    })

    this.leaveRequestForm.patchValue({
      employeeId: Number(this.employeeId)
    });

    console.log(this.leaveRequestForm.value)

    this.fetchHolidayData()
  }

  constructor(
    private leaveRequestService: LeaveRequestsService,
    private userService: UserStoreService,
    private auth: AuthService,
    private router: Router,
    private service: SharedServiceService,
    private fb: FormBuilder
  ) { }

  submitButtonClicked() {
    this.submitStatus = !this.submitStatus;
    this.submitLeaveRequestClicked.emit(this.submitStatus);
  }
  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().padStart(4, '0');
    return `${year}-${month}-${day}`;
  }
  employeeId!: number;
  todayDate: any = new Date();

  leaveTypeData!: LeaveTypeModel[];

  getLeaveType() {
    this.leaveRequestService.getLeaveType().subscribe({
      next: (response: any) => {
        this.leaveTypeData = response.data;
      },
    });
  }

  fetchHolidayData() {
    this.leaveRequestService.getWonderbizholidays().subscribe({
      next: (response: any) => {
        this.wonderbizHolidays = response.data;
        console.log(this.wonderbizHolidays)
      },
    });
  }

  calculateLeaveDays() {
    var startDate = this.getValue('startDate');
    var endDate = this.getValue('endDate');
    let start = new Date(this.getValue('startDate'));
    let end = new Date(this.getValue('endDate'));
    let count = 0;

    if (startDate.match(endDate)) {
      this.leaveRequestForm.get('isHalfDay')?.enable();
      // console.log("isHalfDay")
    } else {
      this.leaveRequestForm.get('isHalfDay')?.disable();
    }
    var event;
    while (start <= end) {
      const dayOfWeek = start.getDay();
      // console.log("start => ", start)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        var date = this.formatDate(start);
        var isHoliday: boolean = false;
        this.wonderbizHolidays.map(
          holiday => {
            // console.log(`${holiday.date} === ${date}`)
            if (holiday.date == date) {
              event = holiday.event;
              isHoliday = true
            }
          });
        if (isHoliday) {
          successToast(`We have holiday on ${date} => ${event}`)
          // console.log("isHoliday => ", isHoliday)
        }
        else {
          count++;
        }
      }
      start.setDate(start.getDate() + 1);
    }
    if (start === end && this.getValue('isHalfDay')) {
      count = 0.5;
    }
    this.leaveRequestForm.patchValue({
      numberOfLeaveDays: count
    });
  }

  getValue(name: string): any {
    return this.leaveRequestForm.get(name)?.value;
  }

  halfDay() {
    console.log("half day")
    if (this.getValue('isHalfDay'))
      this.leaveRequestForm.patchValue({
        numberOfLeaveDays: 0.5
      });
    else {
      this.calculateLeaveDays();
    }
  }

  getDataFromUserStore() {
    this.userService.getEmployeeIdFromStore().subscribe((val) => {
      const employeeIdFromToken = this.auth.getEmployeeIdFromToken();
      this.employeeId = val || employeeIdFromToken;
    });
  }

  handleSubmit() {
    if (this.leaveRequestForm.valid) {
      this.leaveRequestService
      .createLeaveRequest(this.leaveRequestForm.value)
      .subscribe({
        next: (res) => {
          // console.log(res);
          successToast('Leave request created successfully!');
          const buttonRef = document.getElementById('closeBtn');
          buttonRef?.click();
          this.submitStatus = true;
          this.submitButtonClicked();
          this.service.changeData(true);
          this.leaveRequestForm.reset();
          this.ngOnInit();

          // this.router.navigate(['home/leaveRequests']);
          // this.router.navigate([this.router.url]);
        },
        error: (err) =>
          errorToast('Something went wrong while creating Leave Requests!'),
      });
    } else {
      console.log(this.leaveRequestForm.value)
      ValidateForm.validateAllFormFields(this.leaveRequestForm)
    }
    
  }
}
