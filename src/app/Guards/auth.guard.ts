import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../Services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}
  canActivate(): boolean {
    if (!this.auth.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['login']);
      alert('Please Login First!');
      // this.toast.warning({
      //   detail: 'Warning',
      //   summary: 'Please Login first!',
      //   duration: 3000,
      // });
      return false;
    }
  }
}
