import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ClaimService } from 'src/app/services/claim.service';
import { ErrorService } from 'src/app/services/error.service';

@Component({
  selector: 'app-user-claims',
  templateUrl: './user-claims.component.html',
  styleUrls: ['./user-claims.component.css'],
})
export class UserClaimsComponent {
  // public attributes
  public userClaims: any = [];
  public isInfo = false;
  public isLoadError = false;
  public isDeleteError = false;
  public isDeleteSuccess = false;
  public deleteSuccessResponse = '';
  public deleteErrorResponse = '';
  public loadErrorResponse = '';
  public infoResponse = '';

  constructor(
    private readonly _authService: AuthService,
    private readonly _claimService: ClaimService,
    private _errorService: ErrorService,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _router: Router,
  ) {}

  // public attribute
  public userEmail = this._authService.getPayloadValueOf('email');

  ngOnInit(): void {
    this._claimService.getAllUserClaims().subscribe({
      next: (response: any) => {
        if (response.length === 0) {
          this.isInfo = true;
          this.infoResponse = response.message;
        }

        this.userClaims = response;
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
        }, 5000);
      },
    });
  }

  public logout(): void {
    this._authService.logoutUser();
  }

  public editClaim(claimId: string): void {
    this._router.navigate([`claims/edit/${claimId}`], {
      relativeTo: this._activatedRoute,
    });
  }

  public deleteClaim(claimId: string): void {
    this._claimService.deleteClaim(claimId).subscribe({
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
