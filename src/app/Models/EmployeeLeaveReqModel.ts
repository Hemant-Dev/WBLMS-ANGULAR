export interface EmployeeLeaveReqModel {
    id: number;
    firstName: string;
    lastName: string;
    password?: string;
    emailAddress: string;
    contactNumber: string;
    genderId?: number;
    genderName?: string;
    roleId: number;
    roleName?: string;
    managerId?: number;
    managerName?: string;
    joiningDate?: string | Date;
    balanceLeaveRequest?: number,
    totalLeaveRequest?: number
}