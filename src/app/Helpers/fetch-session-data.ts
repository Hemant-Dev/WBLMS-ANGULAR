import { UserSessionModel } from '../Models/user-session-model';
import { AuthService } from '../Services/auth.service';
import { ByRolesService } from '../Services/by-roles.service';
import { UserStoreService } from '../Services/user-store.service';

export class FetchSessionData {
  constructor(private auth: AuthService, private userStore: UserStoreService) {}
  role!: string;
  fullName!: string;
  email!: string;
  employeeId!: string;

  fetchSessionData(initialUserSessionObj: UserSessionModel) {
    this.userStore.getFullNameFromStore().subscribe((val) => {
      const fullNameFromToken = this.auth.getFullNameFromToken();
      this.fullName = val || fullNameFromToken;
      initialUserSessionObj.fullName = this.fullName;
    });
    this.userStore.getRoleFromStore().subscribe((val) => {
      const roleFromToken = this.auth.getRoleFromToken();
      this.role = val || roleFromToken;
      initialUserSessionObj.role = this.role;
    });
    this.userStore.getEmailFromStore().subscribe((val) => {
      const emailFromToken = this.auth.getEmailFromToken();
      this.email = val || emailFromToken;
      initialUserSessionObj.email = this.email;
    });
    this.userStore.getEmployeeIdFromStore().subscribe((val) => {
      const employeeIdFromToken = this.auth.getEmployeeIdFromToken();
      this.employeeId = val || employeeIdFromToken;
      initialUserSessionObj.employeeId = Number(this.employeeId);
    });
  }
}
