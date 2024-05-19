import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../ApiUrl';
import { LeaveRequestModel } from '../Models/leave-requestsModel';

@Injectable({
  providedIn: 'root',
})
export class LeaveRequestsService {
  constructor(private http: HttpClient) {}

  leave_api_url = API_URL + 'LeaveRequest';
  getLeavesBalances(employeeId: number): Observable<any> {
    return this.http.get<any>(
      this.leave_api_url + `/leavesBalance/${employeeId}`
    );
  }

  getLeaveRequests(
    sortColumn: string,
    sortOrder: string,
    page: number,
    pageSize: number,
    leaveReqObj: LeaveRequestModel
  ): Observable<any> {
    return this.http.post<any>(
      this.leave_api_url +
        `/paginated?sortColumn=${sortColumn}&sortOrder=${sortOrder}&page=${page}&pageSize=${pageSize}`,
      leaveReqObj
    );
  }
}
