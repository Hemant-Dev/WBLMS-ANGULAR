import { Component, OnInit } from '@angular/core';
import { EmployeeLeaveReqModel } from 'src/app/Models/EmployeeLeaveReqModel';
import { EmployeeRxjsService } from 'src/app/Services/employee-rxjs.service';

@Component({
  selector: 'app-show-all-employees',
  templateUrl: './show-all-employees.component.html',
  styleUrls: ['./show-all-employees.component.css']
})
export class ShowAllEmployeesComponent implements OnInit {

  data: any;
  options: any;
  dynaminBarThickness = 60;
  setBackgroundColor: any = 'rgb(153, 102, 255)'//  ['rgba(255, 159, 64, 0.2)',] ;
  setBackgroundColor2: any = ['rgba(255, 101, 1, 0.2)',];
  setBackgroundColor3: any = ['rgba(55, 201, 101, 0.2)',];
  currentPage: number = 1;
  pageSize: number = 10;
  sortColumn: string = "";
  sortOrder: string = "";
  initialEmployeeData: EmployeeLeaveReqModel = {
    id: 0,
    firstName: '',
    lastName: '',
    emailAddress: '',
    contactNumber: '',
    roleId: 0,
    genderId: 0,
    genderName: "",
    roleName: "",
    managerId: 0,
    managerName: "",
    joiningDate: "",
    balanceLeaveRequest: 0,
    totalLeaveRequest: 0
  }

  employeeData : any;
  constructor(
    private employeeService: EmployeeRxjsService,
  ) { }
  ngOnInit(): void {
    this.barChart();
    this.getEmployee();
  }
  // this.leaveRequestService.getLeaveType().subscribe({
  //   next: (response: any) => {
  //     this.leaveTypeData = response.data;
  //   },
  // });

  getEmployee() {
    this.employeeService
    .getEmployeesLeaveReq(this.currentPage, this.pageSize,this.sortColumn,this.sortOrder,this.initialEmployeeData)
    .subscribe( ({
      next : (response : any) => {
        console.log(response)
        this.employeeData = response.data;
      }
    }))
  }
  barChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'Octomber', 'November', 'December'],
      datasets: [
        {
          type: 'bar',
          label: 'Dataset 1',
          backgroundColor: this.setBackgroundColor3,//documentStyle.getPropertyValue('--blue-500'),
          data: [50, 25, 12, 48, 90, 76, 42, 50, 25, 12, 48, 90],
          barThickness: this.dynaminBarThickness // Adjust this value to decrease bar width
        },
        {
          type: 'bar',
          label: 'Dataset 2',
          backgroundColor: this.setBackgroundColor,
          data: [21, 84, 24, 75, 37, 65, 34, , 24, 75, 37, 65, 34],
          barThickness: this.dynaminBarThickness // Adjust this value to decrease bar width

        },
        {
          type: 'bar',
          label: 'Dataset 3',
          backgroundColor: this.setBackgroundColor2,//documentStyle.getPropertyValue('--yellow-500'),
          data: [41, 52, 24, 74, 23, 21, 32, 24, 74, 23, 21, 32],
          barThickness: this.dynaminBarThickness // Adjust this value to decrease bar width

        }
      ]
    };

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 1.2,
      plugins: {
        tooltip: {
          mode: 'index',
          intersect: false
        },
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            display: false,
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          stacked: true,
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            display: false,
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
  }
}
