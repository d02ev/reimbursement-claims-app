import { Component, OnInit } from '@angular/core';
import { AuthService, ErrorService, SuperAdminService } from 'src/app/services';

@Component({
  selector: 'app-access-users-admin',
  templateUrl: './access-users-admin.component.html',
  styleUrls: ['./access-users-admin.component.css'],
})
export class AccessUsersAdminComponent implements OnInit {
  constructor(
    private readonly _superAdminService: SuperAdminService,
    private readonly _authService: AuthService,
    private _errorService: ErrorService,
  ) {}

  // public attributes
  public userEmail = this._authService.getPayloadValueOf('email');
  public users: any = [];

  // error capturing
  public isLoadError = false;
  public isGrantError = false;
  public isDeleteError = false;
  public loadErrorResponse = '';
  public grantErrorResponse = '';
  public deleteErrorResponse = '';

  // response capturing
  public isDeleteSuccess = false;
  public isGrantSuccess = false;
  public grantSuccessResponse = '';
  public deleteSuccessResponse = '';

  // info capturing
  public isInfo = false;
  public infoResponse = 'No Registered Users Found!';

  // public methods
  ngOnInit(): void {
    this._superAdminService.getAllUsers().subscribe({
      next: (response: any) => {
        if (response.length === 0) {
          this.isInfo = true;
        }

        this.users = response;
      },
      error: () => {
        this.isLoadError = true;
        this.loadErrorResponse = this._errorService.errorMessage;
        setTimeout(() => {
          this.isLoadError = false;
        }, 5000);
      },
      complete: () => {
        setTimeout(() => {
          this.isInfo = false;
        }, 4500);
      },
    });
  }

  public makeUserAdmin(userId: string): void {
    this._superAdminService.makeAdmin(userId).subscribe({
      next: (response: any) => {
        this.isGrantSuccess = true;
        this.grantSuccessResponse = response.message;
      },
      error: () => {
        this.isGrantError = true;
        this.grantErrorResponse = this._errorService.errorMessage;
        setTimeout(() => {
          this.isGrantError = false;
        }, 5000);
      },
      complete: () => {
        setTimeout(() => {
          window.location.reload();
        }, 4500);
      },
    });
  }

  public deleteUser(userId: string): void {
    this._superAdminService.deleteUser(userId).subscribe({
      next: (response: any) => {
        this.isDeleteSuccess = true;
        this.deleteSuccessResponse = response.message;
      },
      error: () => {
        this.isDeleteError = true;
        this.deleteErrorResponse = this._errorService.errorMessage;
        setTimeout(() => {
          this.isDeleteError = false;
        }, 5000);
      },
      complete: () => {
        setTimeout(() => {
          window.location.reload();
        }, 4500);
      },
    });
  }
}
