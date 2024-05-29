import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { EncodeForms } from 'src/app/Helpers/encodeForms';
import {
  errorAlert,
  errorToast,
  showReasonDisplayMessage,
  successToast,
} from 'src/app/Helpers/swal';
import ValidateForm from 'src/app/Helpers/validateform';
import { LeaveBalance } from 'src/app/Models/leave-balance';
import { LeaveStatusesCount } from 'src/app/Models/leave-statuses-count';
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
  submitStatus: boolean = true;

  leaveRequestForm!: FormGroup;
  wonderbizHolidays!: WonderbizHolidaysModel[];
  leaveBalance!: LeaveBalance;
  leaveStatusesCount!: LeaveStatusesCount;
  isCalendarExpanded = false;
  minDate: Date = new Date();
  maxDate: Date = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 3,
    new Date().getDate()
  );;
  employeeId!: number;
  todayDate: any = new Date();
  todaysDateFormatted = this.formatDate(this.todayDate);
  leaveTypeData!: LeaveTypeModel[];


  ngOnInit(): void {
    console.log(this.maxDate.getMonth())
    this.getLeaveType();
    this.getDataFromUserStore();
    this.submitStatus = false;
    this.fetchHolidayData();
    this.leaveRequestForm = this.fb.group({
      id: 0,
      employeeId: [0, Validators.required],
      leaveTypeId: [0, Validators.required],
      reason: ['', [Validators.required, Validators.maxLength(100)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      numberOfLeaveDays: new FormControl(
        { value: 0, disabled: true },
        Validators.required
      ),
      isHalfDay: [false, Validators.required],
    });
    this.leaveRequestForm.patchValue({
      employeeId: Number(this.employeeId),
    });
    // console.log(this.leaveRequestForm.value);
    this.getLeaveStatusesData(this.employeeId);
    // this.setDate()
   // this.todayDate = this.formatDate(this.todayDate);
  }

  constructor(
    private leaveRequestService: LeaveRequestsService,
    private userService: UserStoreService,
    private auth: AuthService,
    private router: Router,
    private service: SharedServiceService,
    private fb: FormBuilder
  ) {}

  expandCalendar() {
    this.isCalendarExpanded = true;
  }

  shrinkCalendar() {
    this.isCalendarExpanded = false;
  }

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
        // console.log(this.wonderbizHolidays)
      },
    });
  }

  getLeaveBalanceByEmployeeId(employeeId: number) {
    this.leaveRequestService.getLeavesBalances(employeeId).subscribe({
      next: (data: any) => {
        this.leaveBalance = data.data;
        // console.log(this.leaveBalance)
      },
      error: (err) =>
        errorAlert(`Status Code: ${err.StatusCode}` + err.ErrorMessages),
    });
  }

  getLeaveStatusesData(employeeId: number) {
    this.leaveRequestService.getLeaveStatusesCount(employeeId).subscribe({
      next: (res) => {
        this.leaveStatusesCount = res.data;
        this.leaveStatusesCount.leavesRemaining =
          25 -
          (this.leaveStatusesCount.approvedLeavesCount +
            this.leaveStatusesCount.pendingLeavesCount);
      },
      error: (err) =>
        errorAlert(`Status Code: ${err.StatusCode}` + err.ErrorMessages),
    });
  }

  calculateLeaveDays() {
    const showHolidays: WonderbizHolidaysModel[] = [];

    var startDate : Date | string = this.getValue('startDate') != "" ? this.formatDate(this.getValue('startDate')) : "";
    var endDate = this.getValue('endDate') != "" ? this.formatDate(this.getValue('endDate')) : "";
    if (startDate == '' || endDate == '') {
      return;
    }

    console.log(typeof startDate)

    if (this.checkForHalfDayRemaining(startDate, showHolidays)) {
      return;
    }

    if (
      startDate == endDate &&
      this.checkWonderbizHoliday(startDate, showHolidays)
    ) {
      this.leaveRequestForm.controls['isHalfDay']?.disable();
      successToast('We have holiday on this day');
      return;
    }
    let start = new Date(this.getValue('startDate'));
    // start = new Date(
    //   start.setHours(0),
    //   start.setMinutes(0),
    //   start.setSeconds(0)
    // )
    console.log(start)
    let end = new Date(this.getValue('endDate'));
    let count = 0;

    if (
      !this.resetEndDate(
        'Start date should not be greater than end date',
        startDate,
        endDate
      )
    ) {
      this.halfDayIsDisable(startDate, endDate);
      console.log(startDate, endDate)
      while (start <= end) {
        const dayOfWeek = start.getDay();
        // console.log("start => ", start)
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          var date = this.formatDate(start);
          var isHoliday: boolean = this.checkWonderbizHoliday(
            date,
            showHolidays
          );
          if (!isHoliday) {
            count++;
            // console.log(this.leaveStatusesCount.leavesRemaining)
            if (count > this.leaveStatusesCount.leavesRemaining!) {
              this.resetEndDate('You dont have this much leave remaining');
              return;
            }
          }
        }
        start.setDate(start.getDate() + 1);
      }
      if (start === end && this.getValue('isHalfDay')) {
        count = 0.5;
      }
      if(startDate === this.todaysDateFormatted){
        count++;
      }
      this.leaveRequestForm.patchValue({
        numberOfLeaveDays: count,
      });
    }

    if (showHolidays.length) {
      this.showholidaysToast(showHolidays);
    }
  }

  checkForHalfDayRemaining(
    startDate: string,
    showHolidays: WonderbizHolidaysModel[]
  ): boolean {
    if (this.leaveStatusesCount.leavesRemaining === 0.5) {
      this.leaveRequestForm.patchValue({
        endDate: startDate,
        numberOfLeaveDays: 0.5,
        isHalfDay: true,
      });
      if (this.checkWonderbizHoliday(startDate, showHolidays)) {
        this.leaveRequestForm.patchValue({
          startDate: '',
          endDate: '',
        });
        successToast('We have holiday on this day');
        return true;
      }
      successToast('You can take half day');
      return true;
    }
    return false;
  }

  checkWonderbizHoliday(
    date: string,
    showHolidays: WonderbizHolidaysModel[]
  ): boolean {
    var isHoliday: boolean = false;
    this.wonderbizHolidays.map((holiday) => {
      // console.log(`${holiday.date} === ${date}`)
      if (holiday.date == date) {
        var newHoliday: WonderbizHolidaysModel = {
          date: holiday.date,
          event: holiday.event,
        };
        showHolidays.push(newHoliday);
        isHoliday = true;
      }
    });
    return isHoliday;
  }

  showholidaysToast(showHolidays: WonderbizHolidaysModel[]) {
    var showHolidaysDisplayString = 'We have holiday on \n';

    showHolidays.map((holiday) => {
      showHolidaysDisplayString +=
        'Date = ' + holiday.date + '\nEvent = ' + holiday.event;
    });
    successToast(showHolidaysDisplayString);
  }

  resetEndDate(toastMsg: string, start?: string, end?: string): boolean {
    // console.log('You dont have this much leave remaining----------')
    // console.log(start, '  => ', end)
    if ((start === undefined && end === undefined) || start! > end!) {
      this.leaveRequestForm.patchValue({
        endDate: '',
        numberOfLeaveDays: 0,
      });
      // console.log(toastMsg)
      errorToast(toastMsg);
      return true;
    }
    return false;
  }
  resetStartDate() {
    this.leaveRequestForm.patchValue({
      startDate: '',
    });
  }

  getValue(name: string): any {
    return this.leaveRequestForm.get(name)?.value;
  }

  halfDay() {
    // console.log('half day');
    if (this.getValue('isHalfDay'))
      this.leaveRequestForm.patchValue({
        numberOfLeaveDays: 0.5,
      });
    else {
      this.calculateLeaveDays();
    }
  }

  halfDayIsDisable(startDate: string, endDate: string) {
    if (startDate.match(endDate)) {
      this.leaveRequestForm.get('isHalfDay')?.enable();
    } else {
      this.leaveRequestForm.get('isHalfDay')?.disable();
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
      if (!this.getValue('numberOfLeaveDays')) {
        errorAlert('Number of leaves day are zero');
        return;
      }
      this.leaveRequestForm.patchValue({
        reason: EncodeForms.htmlEncode(
          this.leaveRequestForm.controls['reason'].value
        ),
      });
      console.log(this.leaveRequestForm.value)
      this.leaveRequestForm.patchValue({
        startDate : this.formatDate(this.getValue('startDate')),
        endDate : this.formatDate(this.getValue('endDate')),
      })
      console.log(this.leaveRequestForm.value)
      // return;
      this.leaveRequestService
        .createLeaveRequest(this.leaveRequestForm.value)
        .subscribe({
          next: (res) => {
            successToast('Leave request created successfully!');
            const buttonRef = document.getElementById('closeBtn');
            buttonRef?.click();
            this.submitStatus = true;
            this.submitButtonClicked();
            this.service.changeData(this.submitStatus);
            this.leaveRequestForm.reset();
            this.ngOnInit();
          },
          error: (err) =>
            errorAlert(`Status Code: ${err.StatusCode}` + err.ErrorMessages),
        });
    } else {
      // console.log(this.leaveRequestForm.value)
      ValidateForm.validateAllFormFields(this.leaveRequestForm);
    }
  }
}
