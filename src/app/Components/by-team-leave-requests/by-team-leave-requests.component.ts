import { Component, OnInit } from '@angular/core';
import { errorToast, successToast } from 'src/app/Helpers/swal';
import { EmployeeModel } from 'src/app/Models/EmployeeModel';
import { LeaveRequestModel } from 'src/app/Models/leave-requestsModel';
import { UpdateRequestStatus } from 'src/app/Models/update-request-status';
import { ByRolesService } from 'src/app/Services/by-roles.service';
import { LeaveRequestsService } from 'src/app/Services/leave-requests.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-by-team-leave-requests',
  templateUrl: './by-team-leave-requests.component.html',
  styleUrls: ['./by-team-leave-requests.component.css'],
})
export class ByTeamLeaveRequestsComponent implements OnInit {
  leaveRequests!: LeaveRequestModel[];
  initialLeaveRequestObj: LeaveRequestModel = {
    id: 0,
    employeeId: 0,
    managerId: 0,
    firstName: '',
    lastName: '',
    leaveType: '',
    reason: '',
    status: '',
    numberOfLeaveDays: 0,
    roleName: '',
  };
  pageSize: number = 3;
  searchKeyword: string = '';
  constructor(
    private byRolesService: ByRolesService,
    private leaveRequestService: LeaveRequestsService
  ) {}

  ngOnInit(): void {
    this.byRolesService.data$.subscribe((val) => {
      const getRoleFromService = this.byRolesService.role;
      this.initialLeaveRequestObj.roleName = val || getRoleFromService;
    });
    // console.log(this.initialLeaveRequestObj.roleName);
    this.initialLeaveRequestObj.status = 'Pending';
    this.leaveRequestService
      .getLeaveRequestsByRoles(
        '',
        '',
        1,
        100,
        this.initialLeaveRequestObj,
        this.searchKeyword
      )
      .subscribe({
        next: (res) => {
          // console.log(res);
          this.leaveRequests = res.data.dataArray;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  handleRejectClick(Id: number) {
    Swal.fire({
      title: 'Do you want to reject the leave?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Yes',
      denyButtonText: `No`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        const updateLeaveRequestStatus: UpdateRequestStatus = {
          id: Id,
          statusId: 3,
        };
        this.leaveRequestService
          .updateLeaveRequestStatus(Id, updateLeaveRequestStatus)
          .subscribe({
            next: (res) => {
              errorToast('Leave Request Rejected.');
              this.ngOnInit();
            },
            error: (err) => errorToast('Error Occured while updating status'),
          });
      } else if (result.isDenied) {
        // Swal.fire('Changes are not saved', '', 'info');
      }
    });
  }
  handleApproveClick(Id: number) {
    Swal.fire({
      title: 'Do you want to approve the leave?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Yes',
      denyButtonText: `No`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        const updateLeaveRequestStatus: UpdateRequestStatus = {
          id: Id,
          statusId: 2,
        };
        this.leaveRequestService
          .updateLeaveRequestStatus(Id, updateLeaveRequestStatus)
          .subscribe({
            next: (res) => {
              successToast('Leave Request Approved.');
              this.ngOnInit();
            },
            error: (err) => errorToast('Error Occured while updating status'),
          });
      } else if (result.isDenied) {
        // Swal.fire('Changes are not saved', '', 'info');
      }
    });
  }
  handleSearch() {
    this.leaveRequestService
      .getLeaveRequestsByRoles(
        '',
        '',
        1,
        100,
        this.initialLeaveRequestObj,
        this.searchKeyword
      )
      .subscribe({
        next: (res) => {
          // console.log(res);
          this.leaveRequests = res.data.dataArray;
        },
        error: (err) => console.log(err),
      });
  }
}
