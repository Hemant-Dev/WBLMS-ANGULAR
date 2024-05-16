import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../ApiUrl';

@Injectable({
  providedIn: 'root',
})
export class LeaveRequestsService {
  constructor(private http: HttpClient) {}

  leave_api_url = API_URL + 'LeaveRequest/leavesBalance';
  getLeavesBalances(employeeId: number): Observable<any> {
    return this.http.get<any>(this.leave_api_url + `/${employeeId}`);
  }
}
