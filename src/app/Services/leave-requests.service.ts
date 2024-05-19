import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../ApiUrl';
import { LeaveRequestModel } from '../Models/leave-requestsModel';
import { UpdateRequestStatus } from '../Models/update-request-status';

@Injectable({
  providedIn: 'root',
})
export class LeaveRequestsService {
  constructor(private http: HttpClient) { }

  leave_api_url = API_URL + 'LeaveRequest';

  leave_type_url = API_URL + 'leavetype';

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

  updateLeaveRequestStatus(
    id: number,
    requestObj: UpdateRequestStatus
  ): Observable<any> {
    return this.http.put(this.leave_api_url + `/${id}`, requestObj);
  }

  createLeaveRequest(
    data: LeaveRequestModel
  ): Observable<any> {
    return this.http.post(this.leave_api_url, data);
  }

  getLeaveType() : Observable<any> {
    return this.http.get(this.leave_api_url+'/leavetype');
  }
}
