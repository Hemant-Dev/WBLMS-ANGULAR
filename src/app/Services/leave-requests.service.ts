import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../ApiUrl';
import { LeaveRequest } from '../Models/LeaveRequest';

@Injectable({
  providedIn: 'root',
})
export class LeaveRequestsService {
  constructor(private http: HttpClient) {}

  leave_api_url = API_URL + 'LeaveRequest/leavesBalance';

  leave_request_url = API_URL + "leaverequest";
  getLeavesBalances(employeeId: number): Observable<any> {
    return this.http.get<any>(this.leave_api_url + `/${employeeId}`);
  }

  createLeaveRequest(data : LeaveRequest) : Observable<any> {
    return this.http.post<any>(this.leave_request_url, data);
  }

  getLeaveRequest(
    sortColumn : string,
    sortOrder : string,
    page : number,
    pageSize : number,
    data : any
  ) : Observable<any> {
    return this.http.post<any>(this.leave_request_url + `/paginated?sortColumn=${sortColumn}&sortOrder=${sortOrder}&page=${page}&pageSize=${pageSize}`,data)
  }
}
