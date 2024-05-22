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
import { TeamLeaveRequestsTableComponent } from './Components/team-leave-requests-table/team-leave-requests-table.component';
import { AdminGuard } from './Guards/admin.guard';
import { ByTeamLeaveRequestsComponent } from './Components/by-team-leave-requests/by-team-leave-requests.component';

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
      {
        path: 'register',
        component: RegisterComponent,
        canActivate: [AdminGuard],
      },
      { path: 'register/:id', component: RegisterComponent },
      { path: 'profile', component: ProfileComponent },
      {
        path: 'dashboard',
        component: DashboardComponent,
        children: [
          {
            path: 'leaveRequests',
            component: LeaveRequestsTableComponent,
          },
          {
            path: 'teamLeaveRequests',
            component: TeamLeaveRequestsTableComponent,
          },
          {
            path: 'hr',
            component: ByTeamLeaveRequestsComponent,
            canActivate: [AdminGuard],
          },
          {
            path: 'teamLead',
            component: ByTeamLeaveRequestsComponent,
            canActivate: [AdminGuard],
          },
          {
            path: 'employee',
            component: ByTeamLeaveRequestsComponent,
            canActivate: [AdminGuard],
          },
        ],
      },
      { path: 'employee', component: EmployeeComponent },
      { path: 'table', component: TableComponent },
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
