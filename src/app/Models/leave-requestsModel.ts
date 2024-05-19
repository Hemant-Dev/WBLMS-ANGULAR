export interface LeaveRequestModel {
  id: number;
  employeeId: number;
  managerId?: number;
  firstName?: string;
  lastName?: string;
  leaveTypeId? : number,
  leaveType?: string;
  reason: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  numberOfLeaveDays: number;
  requestDate?: string;
  approvedDate?: string;
  isHalfDay? : false
}
