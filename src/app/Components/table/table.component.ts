import { Component, Input, OnInit } from '@angular/core';
import { EmployeeModel } from 'src/app/Models/EmployeeModel';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  @Input() employeesList: EmployeeModel[] = [];

  ngOnInit(): void {
    // console.log(this.employeesList)
  }

  tableHeader = [
    "FirstName",
    "LastName",
    "EmailAddress",
    "ContactNumber",
    "Gender",
    "RoleName",
    "ManagerName"
  ];

 tableHeaderLeave: string[] = ['Id', 'EmployeeId', 'Balance', 'TotalLeaves'];
  employeesData: any[] = [
    { id: 1, employeeId: 2, balance: 25.00, totalLeaves: 25.00 },
    { id: 2, employeeId: 3, balance: 25.00, totalLeaves: 25.00 },
    { id: 3, employeeId: 4, balance: 25.00, totalLeaves: 25.00 }
  ];

}
