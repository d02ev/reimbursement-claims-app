import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorService } from 'src/app/services/error.service';
import { RawLoginFormValue } from 'src/app/shared/dto';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  public loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });
  public formControl = {
    email: this.loginForm.get('email'),
    password: this.loginForm.get('password'),
  };
  public isError = false;
  public errorResponse = '';

  constructor(
    private readonly _authService: AuthService,
    private _errorService: ErrorService,
    private readonly _router: Router,
  ) {}

  public onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this._authService
      .loginUser(this.loginForm.value as RawLoginFormValue)
      .subscribe({
        next: (response: any) => {
          sessionStorage.setItem('access_token', response.access_token);
        },
        error: () => {
          this.isError = true;
          this.errorResponse = this._errorService.errorMessage;
          setTimeout(() => {
            this.isError = false;
          }, 5000);
        },
        complete: () => {
          if (this._authService.isAdmin()) {
            this._router.navigate(['admin/dashboard']);
          } else if (
            !(
              this._authService.isAdmin() &&
              this._authService.isAdminApprover() &&
              this._authService.isUserApprover()
            )
          ) {
            this._router.navigate(['user/dashboard']);
          }
        },
      });
  }
}
