import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../Services/auth.service';
import { Router } from '@angular/router';
import { TokenApi } from '../Models/token-api';
import Swal from 'sweetalert2';
import { errorAlert, errorToast } from '../Helpers/swal';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService, private router: Router) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // debugger;
    const myToken = this.auth.getToken();
    // console.log(myToken);
    if (myToken) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${myToken}` },
      });
    }
    return next.handle(request).pipe(
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            return this.handleUnAuthorizedError(request, next);
          }
          if (err.status === 403) {
            this.router.navigate(['unauthorized']);
          }
          if (err.status === 0) {
            // console.log(err.message);
            errorAlert('Http Connection Error, Server Refused to connect!');
            this.router.navigate(['login']);
          }
        }

        return throwError(() => err);
      })
    );
  }
  handleUnAuthorizedError(req: HttpRequest<any>, next: HttpHandler) {
    // debugger;
    const accessToken = this.auth.getToken();
    const refreshToken = this.auth.getRefreshToken();
    let tokenApi = new TokenApi();
    if (accessToken !== null) {
      tokenApi.accessToken = accessToken;
    }
    if (refreshToken !== null) {
      tokenApi.refreshToken = refreshToken;
    }
    // tokenApi.accessToken ? null : accessToken;
    // tokenApi.refreshToken ? null : refreshToken;
    return this.auth.renewToken(tokenApi).pipe(
      switchMap((data: TokenApi) => {
        this.auth.storeRefreshToken(data.refreshToken);
        this.auth.storeToken(data.accessToken);
        const accessToken = this.auth.getToken();
        req = req.clone({
          setHeaders: { Authorization: `Bearer ${accessToken}` },
        });
        return next.handle(req);
      }),
      catchError((err) => {
        return throwError(() => {
          // this.toast.warning({
          //   detail: 'Warning',
          //   summary: 'Token has expired, Please Login again',
          // });
          errorAlert('Token has expired, Please Log in again!');
          this.router.navigate(['login']);
        });
      })
    );
  }
}
