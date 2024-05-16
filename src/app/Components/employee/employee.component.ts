import { Component } from '@angular/core';
import { EmployeeModel } from 'src/app/Models/EmployeeModel';
import { GetEmployeeAsync, CreateEmployeeAsync } from 'src/app/Services/employee.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent {
  initialEmployeeData: EmployeeModel = {
    id: 0,
    firstName: '',
    lastName: '',
    password: '',
    emailAddress: '',
    contactNumber: '',
    genderId: 1,
    roleId: 1,
    managerId: 1,
    createdById: 1
  }

  employees: EmployeeModel[] = [];
  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'emailAddress', 'contactNumber'];
  searchText: string = '';

  constructor() { }

  async ngOnInit() {
    await this.getAllEmployee();
  }

  async getAllEmployee() {
    try {
      const result = await GetEmployeeAsync(this.initialEmployeeData, "firstname", "asc", 1, 5);
      console.log(result)
      this.employees = result.dataArray;
    } catch (error) {
      console.log(error)
    }
  }

  async handleSubmit() {
    try {
      const result = await CreateEmployeeAsync(this.initialEmployeeData);
    } catch (error) {
      console.log(error)
    }
  }

}
