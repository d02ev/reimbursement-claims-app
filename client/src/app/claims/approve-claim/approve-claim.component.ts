import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClaimService, ErrorService } from 'src/app/services';
import { RawClaimApprovalFormValue } from 'src/app/shared/dto/claims';

@Component({
  selector: 'app-approve-claim',
  templateUrl: './approve-claim.component.html',
  styleUrls: ['./approve-claim.component.css'],
})
export class ApproveClaimComponent {
  constructor(
    private readonly _claimService: ClaimService,
    private readonly _errorService: ErrorService,
    private readonly _router: Router,
    private readonly _activatedRoute: ActivatedRoute,
  ) {}

  // public attributes
  public claimApprovalForm = new FormGroup({
    approvedAmt: new FormControl('', Validators.required),
    internalNotes: new FormControl(''),
  });
  public formControls = {
    approvedAmt: this.claimApprovalForm.get('approvedAmt'),
    internalNotes: this.claimApprovalForm.get('internalNotes'),
  };
  public claimIdParam = this._activatedRoute.snapshot.params['claimId'];
  public isError = false;
  public errorResponse = '';
  public isSuccess = false;
  public successResponse = '';

  // public methods
  public onSubmit(): void {
    this._claimService
      .approveClaim(
        this.claimApprovalForm.value as RawClaimApprovalFormValue,
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
    this.claimApprovalForm.reset();
  }
}
