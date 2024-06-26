import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { EncodeForms } from 'src/app/Helpers/encodeForms';
import { errorAlert, errorToast, successToast } from 'src/app/Helpers/swal';
import ValidateForm from 'src/app/Helpers/validateform';
import { LeaveBalance } from 'src/app/Models/leave-balance';
import { LeaveRequestModel } from 'src/app/Models/leave-requestsModel';
import { LeaveStatusesCount } from 'src/app/Models/leave-statuses-count';
import { LeaveReqByYearModel } from 'src/app/Models/LeaveReqByYearModel';
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

  initialLeaveRequestObj: LeaveRequestModel = {
    id: 0,
    employeeId: 0,
    managerId: 0,
    firstName: '',
    lastName: '',
    leaveType: '',
    reason: '',
    status: '',
    numberOfLeaveDays: 0,
    roleName: '',
    startDate: '0001-01-01',
    endDate: '0001-01-01',
    requestDate: '0001-01-01',
  };

  activeteHalfDay: boolean = false;

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
  );

  currentYear = this.minDate.getFullYear();
  nextYear = this.maxDate.getFullYear();

  employeeId!: number;
  todayDate: any = new Date();
  todaysDateFormatted = this.formatDate(this.todayDate);
  leaveTypeData!: LeaveTypeModel[];
  leaveRequestByYear!: LeaveReqByYearModel;
  oldLeaveRequests: LeaveRequestModel[] = [];

  ngOnInit(): void {
    this.getLeaveType();
    this.getDataFromUserStore();
    this.submitStatus = false;
    this.fetchHolidayData();
    this.leaveRequestForm = this.fb.group({
      id: 0,
      employeeId: [0, Validators.required],
      leaveTypeId: [null, Validators.required],
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
    this.getLeaveStatusesData(this.employeeId);
    this.initialLeaveRequestObj.employeeId = this.employeeId;
    this.fetchOldRequestData();
  }

  constructor(
    private leaveRequestService: LeaveRequestsService,
    private userService: UserStoreService,
    private auth: AuthService,
    private service: SharedServiceService,
    private fb: FormBuilder
  ) { }

  // expandCalendar() {
  //   this.isCalendarExpanded = true;
  // }

  // shrinkCalendar() {
  //   this.isCalendarExpanded = false;
  // }

  fetchOldRequestData() {
    // const searchWord = this.searchKeyword;
    // const EncodedSearchKeyword = EncodeForms.htmlEncode(searchWord);
    this.leaveRequestService
      .getLeaveRequestsByRoles(
        "",
        'desc',
        1,
        25,
        this.initialLeaveRequestObj,
        ""
      )
      .subscribe({
        next: (res) => {
          this.oldLeaveRequests = res.data.dataArray;
          console.log(this.oldLeaveRequests)

          this.oldLeaveRequests.map((res) => {
            console.log(typeof res.startDate)
            console.log(res.startDate, " ", res.endDate)
          })
        },
        error: (err) => {
          console.log(err);
          errorToast(err.error.errorMessages);
        },
      });
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
      },
      error: (err) => {
        errorToast(err.error.errorMessages);
      },
    });
  }

  getLeaveBalanceByEmployeeId(employeeId: number) {
    this.leaveRequestService.getLeavesBalances(employeeId).subscribe({
      next: (data: any) => {
        this.leaveBalance = data.data;
      },
      error: (err) => {
        errorToast(err.error.errorMessages);
      },
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
      error: (err) => {
        errorToast(err.error.errorMessages);
      },
    });
  }

  checkForLeaveAlreadyApplied(start: Date, end?: Date) : boolean {
    //13-02-
    // debugger
    // this.oldLeaveRequests.map((res : LeaveRequestModel) : boolean => {
    //   console.log("Start date type => ",typeof res.startDate)
    //   res.startDate = new Date(res.startDate!)
    //   console.log("Start date type => ",typeof res.startDate)

    //   if(res.startDate! >= start && res.endDate! <= start ){
    //     successToast(`You have already taken holiday from ${res.startDate} to ${res.endDate}`);
    //     return true;
    //   }
    //   return false;
    // })

    return false;
  }

  calculateLeaveDays() {
    const showHolidays: WonderbizHolidaysModel[] = [];

    var startDate: Date | string =
      this.getValue('startDate') != ''
        ? this.formatDate(this.getValue('startDate'))
        : '';

    var endDate =
      this.getValue('endDate') != ''
        ? this.formatDate(this.getValue('endDate'))
        : '';

    let start = new Date(this.getValue('startDate'));
    console.log(start);
    let end = new Date(this.getValue('endDate'));

    if(this.checkForLeaveAlreadyApplied(start,end)){
      return;
    }

    this.halfDayIsDisable(startDate, endDate);



    if (startDate == '' || endDate == '') {
      return;
    }

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

    let count = 0;

    if (
      !this.resetEndDate(
        'Start date should not be greater than end date',
        startDate,
        endDate
      )
    ) {
      console.log(startDate, endDate);
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
      if (startDate === this.todaysDateFormatted && endDate != this.todaysDateFormatted) {
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
    if (startDate == endDate) {
      // this.leaveRequestForm.get('isHalfDay')?.enable();
      // this.leaveRequestForm.patchValue({
      //   isHalfDay : true
      // })
      this.activeteHalfDay = true;
      // this.leaveRequestForm.controls['isHalfDay'].enable();
    } else {
      // this.leaveRequestForm.get('isHalfDay')?.disable();
      this.leaveRequestForm.patchValue({
        isHalfDay: false,
      });
      this.activeteHalfDay = false;
    }
  }

  getDataFromUserStore() {
    this.userService.getEmployeeIdFromStore().subscribe((val) => {
      const employeeIdFromToken = this.auth.getEmployeeIdFromToken();
      this.employeeId = val || employeeIdFromToken;
    });
  }

  handleSubmit() {
    console.log('Submit');
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
      if (this.leaveStatusesCount.leavesRemaining == 0.5) {
        this.leaveRequestForm.patchValue({
          startDate: this.formatDate(this.getValue('startDate')),
        });
        this.leaveRequestForm.patchValue({
          endDate: this.getValue('startDate'),
        });
      } else {
        this.leaveRequestForm.patchValue({
          startDate: this.formatDate(this.getValue('startDate')),
          endDate: this.formatDate(this.getValue('endDate')),
        });
      }
      // return;
      const loader = document.getElementById('loader');
      const modalRef = document.getElementById('request-form');
      // console.log(modalRef);
      if (loader !== null) {
        modalRef?.classList.add('load-overlay');
        loader.style.display = 'block'; // Show the loader
      }
      this.leaveRequestService
        .createLeaveRequest(this.leaveRequestForm.value)
        .subscribe({
          next: (res) => {
            if (loader !== null) {
              modalRef?.classList.remove('load-overlay');
              loader.style.display = 'none'; // Hide the loader
            }
            successToast('Leave request created successfully!');
            const buttonRef = document.getElementById('closeBtn');
            buttonRef?.click();
            this.submitStatus = true;
            this.submitButtonClicked();
            this.service.changeData(this.submitStatus);
            this.leaveRequestForm.reset();
            this.ngOnInit();
          },
          error: (err) => {
            if (loader !== null) {
              modalRef?.classList.remove('load-overlay');
              loader.style.display = 'none'; // Hide the loader
            }
            errorToast(err.error.errorMessages);
          },
        });
    } else {
      // console.log(this.leaveRequestForm.value)
      ValidateForm.validateAllFormFields(this.leaveRequestForm);
    }
  }
  resetForm() {
    this.leaveRequestForm.reset()
  }
}
