import { Component, OnInit } from '@angular/core';
import { errorToast } from 'src/app/Helpers/swal';
import { EmployeeLeaveReqModel } from 'src/app/Models/EmployeeLeaveReqModel';
import {
  LeaveReqByYearModel,
  LeaveRequestStatusModel,
} from 'src/app/Models/LeaveReqByYearModel';
import { EmployeeRxjsService } from 'src/app/Services/employee-rxjs.service';
import { LeaveRequestsService } from 'src/app/Services/leave-requests.service';

@Component({
  selector: 'app-show-all-employees',
  templateUrl: './show-all-employees.component.html',
  styleUrls: ['./show-all-employees.component.css'],
})
export class ShowAllEmployeesComponent implements OnInit {
  data: any;
  options: any;
  dynaminBarThickness = 60;
  setBackgroundColor: any = 'rgb(153, 102, 255)'; //  ['rgba(255, 159, 64, 0.2)',] ;
  setBackgroundColor2: any = ['rgba(255, 101, 1, 0.2)'];
  setBackgroundColor3: any = ['rgba(55, 201, 101, 0.2)'];
  currentPage: number = 1;
  pageSize: number = 10;
  srNoIndex: number = (this.currentPage - 1) * 10 + 1;
  sortColumn: string = '';
  sortOrder: string = '';
  year: number = 2024;

  leaveRequestStatus!: LeaveRequestStatusModel[];
  leaveRequestByYear!: LeaveReqByYearModel;

  initialEmployeeData: EmployeeLeaveReqModel = {
    id: 0,
    firstName: '',
    lastName: '',
    emailAddress: '',
    contactNumber: '',
    roleId: 0,
    genderId: 0,
    genderName: '',
    roleName: '',
    managerId: 0,
    managerName: '',
    joiningDate: '',
    balanceLeaveRequest: 0,
    totalLeaveRequest: 0,
  };

  tableHeader = [
    'Sr. no.',
    'First Name',
    'Last Name',
    'Email Address',
    'Contact Number',
    'Gender',
    'Role Name',
    'Manager Name',
    'Joining Date',
    'Balance Leave',
    'Total Leave',
  ];
  loading: boolean | undefined;

  inreaseSrNoValue() {
    this.srNoIndex++;
  }

  appliedLeaveRequests: number[] = [];
  acceptedLeaveRequests: number[] = [];
  rejectedLeaveRequests: number[] = [];
  pendingLeaveRequests: number[] = [];

  employeeData: EmployeeLeaveReqModel[] = [];
  constructor(
    private employeeService: EmployeeRxjsService,
    private leaveReqService: LeaveRequestsService
  ) {}
  ngOnInit(): void {
    this.getLeaveRequestByYear();
    this.getEmployee();
    this.updateBarThickness();
    window.addEventListener('resize', this.updateBarThickness.bind(this));
  }

  getLeaveRequestByYear() {
    this.leaveReqService.getLeaveRequestsByYear(this.year).subscribe({
      next: (response: any) => {
        console.log(response);
        this.leaveRequestByYear = response.data;

        Object.values(response.data).forEach((monthData: any) => {
          console.log(monthData.acceptedLeaveRequests);

          this.acceptedLeaveRequests.push(monthData.acceptedLeaveRequests);
          this.rejectedLeaveRequests.push(monthData.rejectedLeaveRequests);
          this.pendingLeaveRequests.push(monthData.pendingLeaveRequests);
          this.appliedLeaveRequests.push(monthData.appliedLeaveRequests);
        });
        this.barChart();
        // console.log(this.acceptedLeaveRequests)
      },
      error: (err) => {
        // console.error('Error fetching leave requests by year:', error);
        errorToast(err.error.errorMessages);
      },
    });
  }
  getEmployee() {
    this.employeeService
      .getEmployeesLeaveReq(
        this.currentPage,
        this.pageSize,
        this.sortColumn,
        this.sortOrder,
        this.initialEmployeeData
      )
      .subscribe({
        next: (response: any) => {
          console.log(response);
          this.employeeData = response.data.dataArray;
          console.log(this.employeeData);
        },
        error: (err) => {
          errorToast(err.error.errorMessages);
        },
      });
  }

  updateBarThickness() {
    const width = window.innerWidth;
    if (width < 768) {
      this.dynaminBarThickness = 10;
    } else if (width < 1224) {
      this.dynaminBarThickness = 20;
    } else {
      this.dynaminBarThickness = 23;
    }
    this.barChart();
  }

  barChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data = {
      labels: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'Octomber',
        'November',
        'December',
      ],
      datasets: [
        {
          type: 'bar',
          label: 'Accepted Leaves',

          backgroundColor: documentStyle.getPropertyValue('--green-700'), //this.setBackgroundColor3,//
          // data: [20, 25, 12, 48, 90, 76, 42, 50, 25, 12, 48, 90],
          data: this.acceptedLeaveRequests,
          barThickness: this.dynaminBarThickness, // Adjust this value to decrease bar width
        },
        {
          type: 'bar',
          label: 'Rejected Leaves',
          backgroundColor: documentStyle.getPropertyValue('--red-600'),
          data: this.rejectedLeaveRequests,
          barThickness: this.dynaminBarThickness, // Adjust this value to decrease bar width
        },
        {
          type: 'bar',
          label: 'Pending Leaves',
          backgroundColor: documentStyle.getPropertyValue('--yellow-400'),
          data: this.pendingLeaveRequests,
          barThickness: this.dynaminBarThickness, // Adjust this value to decrease bar width
        },
        {
          type: '',
          label: 'Total Leaves',
          backgroundColor: documentStyle.getPropertyValue('--blue-500'),
          data: this.appliedLeaveRequests,
          barThickness: this.dynaminBarThickness, // Adjust this value to decrease bar width
        },
      ],
    };

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 1.0,
      plugins: {
        tooltip: {
          mode: 'index',
          intersect: true,
        },
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      // scales: {
      //   x: {
      //     stacked: true,
      //     ticks: {
      //       color: textColorSecondary,
      //     },
      //     grid: {
      //       display: false,
      //       color: surfaceBorder,
      //       drawBorder: false,
      //     },
      //   },
      //   y: {
      //     stacked: false,
      //     ticks: {
      //       color: textColorSecondary,
      //     },
      //     grid: {
      //       display: false,
      //       color: surfaceBorder,
      //       drawBorder: true,
      //     },
      //   },
      // },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500,
            },
          },
          grid: {
            color: surfaceBorder,
            drawBorder: true,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: true,
          },
        },
      },
    };
  }
}
