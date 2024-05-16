import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import {
	ApproveClaimRequestDto,
	ApproveClaimResponseDto,
	CreateClaimRequestDto,
	CreateClaimResponseDto,
	DeclineClaimRequestDto,
	DeclineClaimResponseDto,
	DeleteClaimResponseDto,
	FetchClaimResponseDto,
	UpdateClaimRequestDto,
	UpdateClaimResponseDto,
} from '../../dtos';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class ClaimService {
	private readonly _claimUrl = environment.apiUrl + '/claim';

	constructor(private readonly _httpClient: HttpClient) {}

	// create a claim
	createClaim(
		createClaimRequestDto: CreateClaimRequestDto,
	): Observable<CreateClaimResponseDto> {
		return this._httpClient.post<CreateClaimResponseDto>(
			this._claimUrl,
			createClaimRequestDto,
		);
	}

	// fetch all claims
	fetchAllClaims(): Observable<FetchClaimResponseDto[]> {
		return this._httpClient.get<FetchClaimResponseDto[]>(this._claimUrl);
	}

	// fetch user claims
	fetchUserClaims(): Observable<FetchClaimResponseDto[]> {
		return this._httpClient.get<FetchClaimResponseDto[]>(
			this._claimUrl + '/my-claims',
		);
	}

	// fetch claim by id
	fetchClaim(claimId: string): Observable<FetchClaimResponseDto> {
		return this._httpClient.get<FetchClaimResponseDto>(
			`${this._claimUrl}/${claimId}`,
		);
	}

	// update a claim
	updateClaim(
		claimId: string,
		updateClaimRequestDto: UpdateClaimRequestDto,
	): Observable<UpdateClaimResponseDto> {
		return this._httpClient.patch<UpdateClaimResponseDto>(
			`${this._claimUrl}/${claimId}`,
			updateClaimRequestDto,
		);
	}

	// approve a claim
	approveClaim(
		claimId: string,
		approveClaimRequestDto: ApproveClaimRequestDto,
	): Observable<ApproveClaimResponseDto> {
		return this._httpClient.patch<ApproveClaimResponseDto>(
			`${this._claimUrl}/approve/${claimId}`,
			approveClaimRequestDto,
		);
	}

	// decline a claim
	declineClaim(
		claimId: string,
		declineClaimRequestDto?: DeclineClaimRequestDto,
	): Observable<DeclineClaimResponseDto> {
		return this._httpClient.patch<DeclineClaimResponseDto>(
			`${this._claimUrl}/decline/${claimId}`,
			declineClaimRequestDto,
		);
	}

	// delete a claim
	deleteClaim(claimId: string): Observable<DeleteClaimResponseDto> {
		return this._httpClient.delete<DeleteClaimResponseDto>(
			`${this._claimUrl}/${claimId}`,
		);
	}
}
