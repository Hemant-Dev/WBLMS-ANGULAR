import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { errorToast } from '../Helpers/swal';
import { UserStoreService } from '../Services/user-store.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
    private userStore: UserStoreService
  ) {}
  canActivate(): boolean {
    let role = '';
    const roleFromToken = this.auth.getRoleFromToken();
    this.userStore.getRoleFromStore().subscribe({
      next: (val) => {
        role = val || roleFromToken;
      },
    });

    if (!this.auth.isLoggedIn() && role === 'Admin') {
      return true;
    } else {
      this.router.navigate(['home/dashboard']);
      errorToast('Only Admins can visit!');
      return false;
    }
  }
}
