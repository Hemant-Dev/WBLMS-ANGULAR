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
import { LeaveRequestsTableComponent } from './Components/leave-requests-table/leave-requests-table.component';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { FieldsetModule } from 'primeng/fieldset';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { LeaveRequestComponent } from './Components/leave-request/leave-request.component';
import { TeamLeaveRequestsTableComponent } from './Components/team-leave-requests-table/team-leave-requests-table.component';
import { ByTeamLeaveRequestsComponent } from './Components/by-team-leave-requests/by-team-leave-requests.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { AutoFocusModule } from 'primeng/autofocus';
import { ChipModule } from 'primeng/chip';
import { ChartModule } from 'primeng/chart';
import { CalendarModule } from 'primeng/calendar';
import { ShowAllEmployeesComponent } from './Components/show-all-employees/show-all-employees.component';
import { HTMLEncodePipe } from './Pipes/htmlencode.pipe';
import { KnobModule } from 'primeng/knob';
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
    LeaveRequestsTableComponent,
    LeaveRequestComponent,
    TeamLeaveRequestsTableComponent,
    ByTeamLeaveRequestsComponent,
    ShowAllEmployeesComponent,
    HTMLEncodePipe,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    ButtonModule,
    TableModule,
    TagModule,
    FieldsetModule,
    MultiSelectModule,
    DropdownModule,
    CommonModule,
    InputTextModule,
    InputNumberModule,
    AutoFocusModule,
    ChipModule,
    CalendarModule,
    ChartModule,
    KnobModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
