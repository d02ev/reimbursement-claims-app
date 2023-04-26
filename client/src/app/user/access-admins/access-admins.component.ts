import { Component, OnInit } from '@angular/core';
import { AuthService, ErrorService, SuperAdminService } from 'src/app/services';

@Component({
  selector: 'app-access-admins',
  templateUrl: './access-admins.component.html',
  styleUrls: ['./access-admins.component.css'],
})
export class AccessAdminsComponent implements OnInit {
  constructor(
    private readonly _authService: AuthService,
    private _errorService: ErrorService,
    private readonly _superAdminService: SuperAdminService,
  ) {}

  // public attributes
  public admins: any = [];

  // error capturing
  public isLoadError = false;
  public isRevokeError = false;
  public loadErrorResponse = '';
  public revokeErrorResponse = '';

  // success capturing
  public isRevokeSuccess = false;
  public revokeSuccessResponse = '';

  // info capturing
  public isInfo = false;
  public infoResponse = '';

  // public methods
  ngOnInit(): void {
    this._superAdminService.getAllAdmins().subscribe({
      next: (response: any) => {
        if (response.length === 0) {
          this.isInfo = true;
          this.infoResponse = response.message;
        }

        this.admins = response;
      },
      error: () => {
        this.isLoadError = true;
        this.loadErrorResponse = this._errorService.errorMessage;
        setTimeout(() => {
          this.isLoadError = false;
        }, 5000);
      },
    });
  }

  public removeUserAsAdmin(userId: string): void {
    this._superAdminService.removeAdmin(userId).subscribe({
      next: (response: any) => {
        this.isRevokeSuccess = true;
        this.revokeSuccessResponse = response.message;
      },
      error: () => {
        this.isRevokeError = true;
        this.revokeErrorResponse = this._errorService.errorMessage;
        setTimeout(() => {
          this.isRevokeError = false;
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
