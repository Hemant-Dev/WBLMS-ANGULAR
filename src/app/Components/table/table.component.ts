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


}
