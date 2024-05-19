export interface LeaveRequest {
    id : number,
    employeeId : number,
    managerId? : number,
    firstName? : string,
    lastName? : string,
    leaveTypeId : number,
    leaveType? : string,
    reason : string,
    status? : string,
    startDate : Date | null |string,
    endDate : Date | null |string,
    numberOfLeaveDays : number,
    requestDate? : Date | null | string,
    approvedDate? : Date | null | string,
    isHalfDay? : boolean
}