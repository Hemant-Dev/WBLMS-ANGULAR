import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserStoreService {
  private fullName$ = new BehaviorSubject<string>('');
  private role$ = new BehaviorSubject<string>('');
  private email$ = new BehaviorSubject<string>('');
  private employeeId$ = new BehaviorSubject<string>('');
  private managerId$ = new BehaviorSubject<string>('');
  constructor() {}

  public getRoleFromStore() {
    return this.role$.asObservable();
  }
  public setRoleToStore(role: string) {
    this.role$.next(role);
  }
  public getFullNameFromStore() {
    return this.fullName$.asObservable();
  }
  public setFullNameToStore(fullName: string) {
    this.fullName$.next(fullName);
  }
  public getEmailFromStore() {
    return this.email$.asObservable();
  }
  public setEmailToStore(email: string) {
    this.email$.next(email);
  }
  public getEmployeeIdFromStore() {
    return this.employeeId$.asObservable();
  }
  public setEmployeeIdToStore(employeeId: string) {
    this.employeeId$.next(employeeId);
  }
  public getManagerIdFromStore() {
    return this.managerId$.asObservable();
  }

  public setManagerIdFromStore(managerId: string) {
    return this.managerId$.next(managerId);
  }
}
