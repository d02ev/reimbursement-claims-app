import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services';

@Component({
  selector: 'app-super-admin-home',
  templateUrl: './super-admin-home.component.html',
  styleUrls: ['./super-admin-home.component.css'],
})
export class SuperAdminHomeComponent {
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

  public accessAdmins(): void {
    this._router.navigate(['admins'], { relativeTo: this._activatedRoute });
  }

  public goHome(): void {
    this._router.navigate(['super/dashboard']);
  }

  public isRouteChanged(): boolean {
    if (this._router.url !== '/super/dashboard') {
      return true;
    }

    return false;
  }
}
