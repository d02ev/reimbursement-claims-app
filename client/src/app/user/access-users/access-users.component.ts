import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorService } from 'src/app/services/error.service';

@Component({
  selector: 'app-access-users',
  templateUrl: './access-users.component.html',
  styleUrls: ['./access-users.component.css'],
})
export class AccessUsersComponent implements OnInit {
  constructor(
    private readonly _adminService: AdminService,
    private readonly _authService: AuthService,
    private _errorService: ErrorService,
  ) {}

  // public attributes
  public userEmail = this._authService.getPayloadValueOf('email');

  // error capturing
  public isLoadError = false;
  public isMakeError = false;
  public makeErrorResponse = '';
  public loadErrorResponse = '';

  // success capturing
  public isMakeSuccess = false;
  public makeSuccessResponse = '';

  // info capturing
  public isInfo = false;
  public infoResponse = 'No Registered Users Found!';

  // response capturing
  public users: any = [];

  // public methods
  ngOnInit(): void {
    this._adminService.getAllUsers().subscribe({
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

  public makeUserApprover(userId: string): void {
    this._adminService.makeApprover(userId).subscribe({
      next: (response: any) => {
        this.isMakeSuccess = true;
        this.makeSuccessResponse = response.message;
      },
      error: () => {
        this.isMakeError = true;
        this.makeErrorResponse = this._errorService.errorMessage;
        setTimeout(() => {
          this.isMakeError = false;
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
