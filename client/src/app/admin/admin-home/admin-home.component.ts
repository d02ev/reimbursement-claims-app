import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css'],
})
export class AdminHomeComponent {
  constructor(
    private readonly _authService: AuthService,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _router: Router,
  ) {}

  // public attributes
  public userEmail = this._authService.getPayloadValueOf('email');

  // public method
  public logout(): void {
    this._authService.logoutUser();
  }

  public accessApprovers(): void {
    this._router.navigate(['approvers'], { relativeTo: this._activatedRoute });
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

  public goHome(): void {
    this._router.navigate(['admin/dashboard']);
  }

  public isAdminApprover(): boolean {
    if (this._authService.isAdminApprover()) {
      return true;
    }

    return false;
  }

  public isRouteChanged(): boolean {
    if (this._router.url !== '/admin/dashboard') {
      return true;
    }

    return false;
  }
}
