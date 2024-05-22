import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedServiceService {
  data = new BehaviorSubject(false);
  data$ = this.data.asObservable();

  changeData(data: boolean) {
    this.data.next(data);
  }
}
