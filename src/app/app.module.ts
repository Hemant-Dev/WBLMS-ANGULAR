import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './Components/header/header.component';
import { SideNavComponent } from './Components/side-nav/side-nav.component';
import { LoginComponent } from './Components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HeaderSidenavComponent } from './Components/header-sidenav/header-sidenav.component';
import { NotFound404Component } from './Components/not-found404/not-found404.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { EmployeeComponent } from './Components/employee/employee.component';
import { TokenInterceptor } from './Interceptors/token.interceptor';
import { LeavesRemainingDashboardComponent } from './Components/leaves-remaining-dashboard/leaves-remaining-dashboard.component';
import { RegisterComponent } from './Components/register/register.component';
import { TableComponent } from './Components/table/table.component';
import { ResetPasswordComponent } from './Components/reset-password/reset-password.component';
import { LeaveRequestComponent } from './Components/leave-request/leave-request.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SideNavComponent,
    LoginComponent,
    HeaderSidenavComponent,
    NotFound404Component,
    ProfileComponent,
    DashboardComponent,
    EmployeeComponent,
    LeavesRemainingDashboardComponent,
    RegisterComponent,
    TableComponent,
    ResetPasswordComponent,
    LeaveRequestComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
