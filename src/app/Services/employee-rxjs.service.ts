import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../ApiUrl';
import { EmployeeModel } from '../Models/EmployeeModel';
import { Observable } from 'rxjs';
import { PaginatedModel } from '../Models/PaginatedModel';

@Injectable({
  providedIn: 'root',
})
export class EmployeeRxjsService {
  constructor(private http: HttpClient) {}

  api_url = API_URL + 'employee';

  getEmployees(
    page: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    initialEmployeeObj: EmployeeModel
  ): Observable<any> {
    return this.http.post<any>(
      this.api_url +
        `/paginated?page=${page}&pageSize=${pageSize}&sortColumn=${sortColumn}&sortOrder=${sortOrder}`,
      initialEmployeeObj
    );
  }
}
