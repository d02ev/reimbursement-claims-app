import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ClaimService } from 'src/app/services/claim.service';
import { ErrorService } from 'src/app/services/error.service';

@Component({
  selector: 'app-claims-home',
  templateUrl: './claims-home.component.html',
  styleUrls: ['./claims-home.component.css'],
})
export class ClaimsHomeComponent implements OnInit {
  public pendingClaims: any = [];
  public isInfo = false;
  public isError = false;
  public infoResponse = 'No Pending Claims Found!';
  public errorResponse = '';

  constructor(
    private readonly _authService: AuthService,
    private readonly _claimService: ClaimService,
    private _errorService: ErrorService,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _router: Router,
  ) {}

  ngOnInit(): void {
    this._claimService.getAllPendingClaims().subscribe({
      next: (response: any) => {
        if (response.length === 0) {
          this.isInfo = true;
        }

        this.pendingClaims = response;
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

  public approveClaim(claimId: string): void {
    this._router.navigate([`approve/${claimId}`], {
      relativeTo: this._activatedRoute,
    });
  }

  public declineClaim(claimId: string): void {
    this._router.navigate([`decline/${claimId}`], {
      relativeTo: this._activatedRoute,
    });
  }
}
