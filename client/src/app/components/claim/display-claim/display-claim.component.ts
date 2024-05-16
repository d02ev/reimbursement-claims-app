import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClaimService } from '../../../services';
import { FetchClaimResponseDto } from '../../../../dtos';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
	selector: 'app-display-claim',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './display-claim.component.html',
	styleUrl: './display-claim.component.css',
})
export class DisplayClaimComponent implements OnInit {
	loggedInUserRole: string = '';
	claims: FetchClaimResponseDto[] = [];

	constructor(
		private readonly _activatedRoute: ActivatedRoute,
		private readonly _claimService: ClaimService,
	) {}

	ngOnInit(): void {
		this.loggedInUserRole = this._activatedRoute.snapshot.data['role'];

		if (this.loggedInUserRole === 'Admin') {
			this._claimService.fetchAllClaims().subscribe({
				next: (response: FetchClaimResponseDto[]) => {
					this.claims = response;
					window.localStorage.setItem('claims', JSON.stringify(response));
				},
				error: (error: HttpErrorResponse) => {},
				complete: () => {},
			});
		} else if (this.loggedInUserRole === 'User') {
			this._claimService.fetchUserClaims().subscribe({
				next: (response: FetchClaimResponseDto[]) => {
					this.claims = response;
					window.localStorage.setItem('claims', JSON.stringify(response));
				},
				error: (error: HttpErrorResponse) => {},
				complete: () => {},
			});
		}
	}

	// specific to a non-admin user
	update() {}
	delete() {}

	// specific to only admin
	approve() {}
	decline() {}
}
