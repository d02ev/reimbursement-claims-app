import { Component, OnInit } from '@angular/core';
import { AdminService, AuthService, ErrorService } from 'src/app/services';

@Component({
  selector: 'app-access-approvers',
  templateUrl: './access-approvers.component.html',
  styleUrls: ['./access-approvers.component.css'],
})
export class AccessApproversComponent implements OnInit {
  constructor(
    private readonly _authService: AuthService,
    private _errorService: ErrorService,
    private readonly _adminService: AdminService,
  ) {}

  // public attributes
  public approvers: any = [];

  // error capturing
  public isLoadError = false;
  public isRemoveError = false;
  public loadErrorResponse = '';
  public removeErrorResponse = '';

  // info capturing
  public isInfo = false;
  public infoResponse = '';

  // success capturing
  public isRemoveSuccess = false;
  public removeSuccessResponse = '';

  // public methods
  ngOnInit(): void {
    this._adminService.getAllApprovers().subscribe({
      next: (response: any) => {
        if (response.length === 0) {
          this.isInfo = true;
          this.infoResponse = response.message;
        }

        this.approvers = response;
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

  public removeUserAsApprover(userId: string): void {
    this._adminService.removeApprover(userId).subscribe({
      next: (response: any) => {
        this.isRemoveSuccess = true;
        this.removeSuccessResponse = response.message;
      },
      error: () => {
        this.isRemoveError = true;
        this.removeErrorResponse = this._errorService.errorMessage;
        setTimeout(() => {
          this.isRemoveError = false;
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
