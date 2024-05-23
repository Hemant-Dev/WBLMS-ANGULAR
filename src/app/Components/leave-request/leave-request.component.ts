import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { errorAlert, errorToast, successToast } from 'src/app/Helpers/swal';
import ValidateForm from 'src/app/Helpers/validateform';
import { LeaveBalance } from 'src/app/Models/leave-balance';
import { LeaveRequestModel } from 'src/app/Models/leave-requestsModel';
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
  submitStatus: boolean = false;

  leaveRequestForm!: FormGroup;
  wonderbizHolidays!: WonderbizHolidaysModel[];
  leaveBalance!: LeaveBalance;
  leaveStatusesCount!: LeaveStatusesCount;

  ngOnInit(): void {
    // console.log('fetch data');
    this.getLeaveType();
    this.getDataFromUserStore();

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
    // console.log(this.leaveRequestForm.value)
    this.getLeaveStatusesData(this.employeeId);
  }

  constructor(
    private leaveRequestService: LeaveRequestsService,
    private userService: UserStoreService,
    private auth: AuthService,
    private router: Router,
    private service: SharedServiceService,
    private fb: FormBuilder
  ) {}

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
        // console.log(this.wonderbizHolidays)
      },
    });
  }

  getLeaveBalanceByEmployeeId(employeeId: number) {
    this.leaveRequestService.getLeavesBalances(employeeId).subscribe({
      next: (data: any) => {
        this.leaveBalance = data.data;
        console.log(this.leaveBalance);
      },
      error: (err) => console.log(err),
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
        // console.log(this.leaveStatusesCount);
      },
      error: (err) => console.log(err),
    });
  }

  calculateLeaveDays() {
    const showHolidays: WonderbizHolidaysModel[] = [];

    var startDate = this.getValue('startDate');
    var endDate = this.getValue('endDate');

    if (startDate == '' || endDate == '') {
      return;
    }
    let start = new Date(this.getValue('startDate'));
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
      while (start <= end) {
        const dayOfWeek = start.getDay();
        // console.log("start => ", start)
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          var date = this.formatDate(start);
          var isHoliday: boolean = false;
          this.wonderbizHolidays.map((holiday) => {
            // console.log(`${holiday.date} === ${date}`)
            if (holiday.date == date) {
              isHoliday = true;
              var newHoliday: WonderbizHolidaysModel = {
                date: holiday.date,
                event: holiday.event,
              };
              showHolidays.push(newHoliday);
            }
          });
          if (!isHoliday) {
            count++;
            console.log(this.leaveStatusesCount.leavesRemaining);
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
      this.leaveRequestForm.patchValue({
        numberOfLeaveDays: count,
      });
    }
    console.log(showHolidays);
    var showHolidaysDisplayString = 'We have holiday on \n';

    if (showHolidays.length) {
      this.showholidaysToast(showHolidays);
    }
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
    console.log('You dont have this much leave remaining----------');
    console.log(start, '  => ', end);
    if ((start === undefined && end === undefined) || start! > end!) {
      this.leaveRequestForm.patchValue({
        endDate: '',
        numberOfLeaveDays: 0,
      });
      console.log(toastMsg);
      errorToast(toastMsg);
      return true;
    }
    return false;
  }

  getValue(name: string): any {
    return this.leaveRequestForm.get(name)?.value;
  }

  halfDay() {
    console.log('half day');
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
      this.leaveRequestService
        .createLeaveRequest(this.leaveRequestForm.value)
        .subscribe({
          next: (res) => {
            successToast('Leave request created successfully!');
            const buttonRef = document.getElementById('closeBtn');
            buttonRef?.click();
            this.submitStatus = true;
            this.submitButtonClicked();
            this.service.changeData(true);
            this.leaveRequestForm.reset();
            this.ngOnInit();
          },
          error: (err) =>
            errorToast('Something went wrong while creating Leave Requests!'),
        });
    } else {
      // console.log(this.leaveRequestForm.value)
      ValidateForm.validateAllFormFields(this.leaveRequestForm);
    }
  }
}
