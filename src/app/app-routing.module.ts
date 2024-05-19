import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { HeaderSidenavComponent } from './Components/header-sidenav/header-sidenav.component';
import { NotFound404Component } from './Components/not-found404/not-found404.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { AuthGuard } from './Guards/auth.guard';
import { EmployeeComponent } from './Components/employee/employee.component';
import { RegisterComponent } from './Components/register/register.component';
import { TableComponent } from './Components/table/table.component';
import { ResetPasswordComponent } from './Components/reset-password/reset-password.component';
import { LeaveRequestsTableComponent } from './Components/leave-requests-table/leave-requests-table.component';
import { LeaveRequestComponent } from './Components/leave-request/leave-request.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  { path: 'login', component: LoginComponent, title: 'Login' },
  {
    path: 'reset',
    component: ResetPasswordComponent,
  },
  {
    path: 'home',
    component: HeaderSidenavComponent,
    title: 'WBLMS',
    children: [
      { path: 'register', component: RegisterComponent },
      { path: 'register/:id', component: RegisterComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'employee', component: EmployeeComponent },
      { path: 'table', component: TableComponent },
      { path: 'test', component: LeaveRequestComponent },
      {
        path: 'leaveRequests',
        component: LeaveRequestsTableComponent,
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    component: NotFound404Component,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}