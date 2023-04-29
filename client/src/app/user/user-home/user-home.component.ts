import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css'],
})
export class UserHomeComponent {
  constructor(
    private readonly _authService: AuthService,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _router: Router,
  ) {}

  // public attributes
  public userEmail = this._authService.getPayloadValueOf('email');

  // public methods
  public logout(): void {
    this._authService.logoutUser();
  }

  public createReimbursement(): void {
    this._router.navigate(['claims/create'], {
      relativeTo: this._activatedRoute,
    });
  }

  public goHome(): void {
    this._router.navigate(['user/dashboard']);
  }

  public goToClaimsPage(): void {
    this._router.navigate(['claims'], { relativeTo: this._activatedRoute });
  }

  public goToApprovedClaimsPage(): void {
    this._router.navigate(['claims/approved'], {
      relativeTo: this._activatedRoute,
    });
  }

  public goToDeclinedClaimsPage(): void {
    this._router.navigate(['claims/declined'], {
      relativeTo: this._activatedRoute,
    });
  }

  public goToUserProfilePage(): void {
    this._router.navigate(['profile'], { relativeTo: this._activatedRoute });
  }

  public isUserApprover(): boolean {
    if (this._authService.isUserApprover()) {
      return true;
    }

    return false;
  }

  public isChangedRoute(): boolean {
    if (
      this._router.url.includes('/claims') ||
      this._router.url.includes('/profile')
    ) {
      return true;
    }

    return false;
  }
}
