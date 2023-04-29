import { Component, OnInit } from '@angular/core';
import { ClaimService, ErrorService } from 'src/app/services';

@Component({
  selector: 'app-approved-claims',
  templateUrl: './approved-claims.component.html',
  styleUrls: ['./approved-claims.component.css'],
})
export class ApprovedClaimsComponent implements OnInit {
  constructor(
    private readonly _claimService: ClaimService,
    private readonly _errorService: ErrorService,
  ) {}

  // public attributes
  public isError = false;
  public errorResponse = '';
  public isInfo = false;
  public infoResponse = 'No Approved Claims Found!';
  public approvedClaims: any = [];

  // public methods
  ngOnInit(): void {
    this._claimService.getAllApprovedClaims().subscribe({
      next: (response: any) => {
        if (response.length === 0) {
          this.isInfo = true;
        }

        this.approvedClaims = response;
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
          this.isInfo = false;
        }, 4500);
      },
    });
  }
}
