import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ByRolesService {
  data = new BehaviorSubject('');
  data$ = this.data.asObservable();
  role: string = '';
  changeData(data: string) {
    this.data.next(data);
  }
  saveData(role: string) {
    this.role = role;
  }
}
