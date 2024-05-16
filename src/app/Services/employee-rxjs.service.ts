import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../ApiUrl';
import { EmployeeModel } from '../Models/EmployeeModel';
import { Observable } from 'rxjs';
import { PaginatedModel } from '../Models/PaginatedModel';
import { GenderModel } from '../Models/GenderModel';
import { ManagerModel } from '../Models/ManagerModel';
import { RolesModel } from '../Models/RolesModels';

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

  getGenders() : Observable<GenderModel[]> {
    return this.http.get<GenderModel[]>(
      this.api_url+`/gender`
    );
  }

  getManagers(id : number) : Observable<ManagerModel[]> {
    return this.http.get<ManagerModel[]>(
      this.api_url+`/manager/${id}`
    );
  }

  getRoles() : Observable<RolesModel[]> {
    return this.http.get<RolesModel[]>(
      this.api_url+`/roles`
    );
  }
}
