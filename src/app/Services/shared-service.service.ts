import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedServiceService {
  data = new BehaviorSubject(false);
  data$ = this.data.asObservable();
  profile = new BehaviorSubject(false);
  profile$ = this.profile.asObservable();
  changeData(data: boolean) {
    this.data.next(data);
  }
  refreshProfilePic(data: boolean) {
    this.profile.next(data);
  }
}
