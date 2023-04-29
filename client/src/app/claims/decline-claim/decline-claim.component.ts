import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClaimService, ErrorService } from 'src/app/services';
import { RawClaimDecliningFormValue } from 'src/app/shared/dto/claims';

@Component({
  selector: 'app-decline-claim',
  templateUrl: './decline-claim.component.html',
  styleUrls: ['./decline-claim.component.css'],
})
export class DeclineClaimComponent {
  constructor(
    private readonly _claimService: ClaimService,
    private readonly _errorService: ErrorService,
    private readonly _router: Router,
    private readonly _activatedRoute: ActivatedRoute,
  ) {}

  // public attributes
  public claimDecliningForm = new FormGroup({
    internalNotes: new FormControl('', Validators.required),
  });
  public formControls = {
    internalNotes: this.claimDecliningForm.get('internalNotes'),
  };
  public claimIdParam = this._activatedRoute.snapshot.params['claimdId'];
  public isError = false;
  public errorResponse = '';
  public isSuccess = false;
  public successResponse = '';

  // public methods
  public onSubmit(): void {
    this._claimService
      .declineClaim(
        this.claimDecliningForm.value as RawClaimDecliningFormValue,
        this.claimIdParam,
      )
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
          }, 4500);
        },
      });
  }

  public onReset(): void {
    this.claimDecliningForm.reset();
  }
}
