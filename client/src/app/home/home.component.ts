import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  constructor(
    private readonly _router: Router,
    private readonly _activatedRoute: ActivatedRoute,
  ) {}

  // public methods
  public goToLoginPage(): void {
    this._router.navigate(['auth/login'], { relativeTo: this._activatedRoute });
  }

  public goToRegisterPage(): void {
    this._router.navigate(['auth/register'], {
      relativeTo: this._activatedRoute,
    });
  }
}
