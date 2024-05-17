export interface EmployeeModel {
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
  createdById?: number;
  createdByName?: string;
  joiningDate?: string | Date;
  updatedById?: number;
  updatedByName?: string;
  updatedDate?: string;
  tokenId?: number;
}
