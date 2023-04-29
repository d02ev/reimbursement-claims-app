import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ClaimService } from 'src/app/services/claim.service';
import { ErrorService } from 'src/app/services/error.service';
import { RawClaimCreationFormValue } from 'src/app/shared/dto/claims';

@Component({
  selector: 'app-create-claim',
  templateUrl: './create-claim.component.html',
  styleUrls: ['./create-claim.component.css'],
})
export class CreateClaimComponent {
  constructor(
    private readonly _authService: AuthService,
    private _errorService: ErrorService,
    private readonly _claimService: ClaimService,
    private readonly _router: Router,
  ) {}

  // public attributes
  public claimCreationForm = new FormGroup({
    date: new FormControl('', [Validators.required]),
    type: new FormControl('', Validators.required),
    requestedAmt: new FormControl('', [Validators.required]),
    currency: new FormControl('', Validators.required),
    receipt: new FormControl(''),
  });
  public formControls = {
    date: this.claimCreationForm.get('date'),
    type: this.claimCreationForm.get('type'),
    requestedAmt: this.claimCreationForm.get('requestedAmt'),
    currency: this.claimCreationForm.get('currency'),
    receipt: this.claimCreationForm.get('receipt'),
  };
  public userEmail = this._authService.getPayloadValueOf('email');

  public isError = false;
  public isSuccess = false;
  public errorResponse = '';
  public successResponse = '';
  public selectedReceipt: any;

  // public methods
  public onSubmit(): void {
    this._claimService
      .generateClaim(this.claimCreationForm.value as RawClaimCreationFormValue)
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
            this._router.navigate(['user/dashboard']);
          }, 4500);
        },
      });
  }

  public onCancel(): void {
    this._router.navigate(['user/dashboard']);
  }

  public onFileSelected(event: any) {
    this.selectedReceipt = (event.target as HTMLInputElement).files?.[0];
    this.claimCreationForm.patchValue({ receipt: this.selectedReceipt });
    this.formControls.receipt?.updateValueAndValidity();
  }
}
