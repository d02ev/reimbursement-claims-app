import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, ErrorService } from 'src/app/services';
import { RawRegistrationFormValue } from 'src/app/shared/dto';
import { matchValidator } from 'src/app/shared/form-validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _errorService: ErrorService,
  ) {}

  // public attributes
  public registrationForm = new FormGroup({
    fullName: new FormControl('', [
      Validators.required,
      Validators.maxLength(255),
      Validators.pattern(/^[a-zA-Z\s]+$/),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    PAN: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/),
    ]),
    bankName: new FormControl('', Validators.required),
    bankAccountNumber: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9]{12}$/),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/),
      matchValidator('confirmPassword', true),
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/),
      matchValidator('password'),
    ]),
  });
  public formControls = {
    fullName: this.registrationForm.get('fullName'),
    email: this.registrationForm.get('email'),
    PAN: this.registrationForm.get('PAN'),
    bankName: this.registrationForm.get('bankName'),
    bankAccountNumber: this.registrationForm.get('bankAccountNumber'),
    password: this.registrationForm.get('password'),
    confirmPassword: this.registrationForm.get('confirmPassword'),
  };
  public isError = false;
  public isSuccess = false;
  public successResponse = '';
  public errorResponse = '';

  // public methods
  public onSubmit(): void {
    if (this.registrationForm.invalid) {
      return;
    }

    this._authService
      .registerUser(this.registrationForm.value as RawRegistrationFormValue)
      .subscribe({
        next: (response: any) => {
          this.isSuccess = true;
          this.successResponse = response.message;
        },
        error: () => {
          this.isError = true;
          this.errorResponse = this._errorService.errorMessage;

          setTimeout(() => {
            this.isError = false;
          }, 5000);
        },
        complete: () => {
          setTimeout(() => {
            this.isSuccess = false;
            this._router.navigate(['auth/login']);
          }, 5000);
        },
      });
  }

  public onReset(): void {
    this.registrationForm.reset();
  }
}
