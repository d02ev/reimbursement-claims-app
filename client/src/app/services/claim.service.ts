import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ApproveClaimDto,
  CreateClaimDto,
  DeclineClaimDto,
} from '../shared/dto/claims';

@Injectable({
  providedIn: 'root',
})
export class ClaimService {
  // private attirbute
  private _baseUrl = 'http://localhost:5000/api/v1/claim';

  constructor(private readonly _httpClient: HttpClient) {}

  // public methods
  public generateClaim(claimData: CreateClaimDto): Observable<any> {
    const claimDataToSend = new FormData();
    claimDataToSend.append('date', claimData.date);
    claimDataToSend.append('type', claimData.type);
    claimDataToSend.append('requestedAmt', claimData.requestedAmt);
    claimDataToSend.append('currency', claimData.currency);
    claimDataToSend.append('receipt', claimData.receipt);

    return this._httpClient.post(this._baseUrl, claimDataToSend);
  }

  public getAllClaims(): Observable<any> {
    return this._httpClient.get(this._baseUrl);
  }

  public getAllPendingClaims(): Observable<any> {
    return this._httpClient.get(this._baseUrl + '/pending/all');
  }

  public getAllApprovedClaims(): Observable<any> {
    return this._httpClient.get(this._baseUrl + '/approved/all');
  }

  public getAllDeclinedClaims(): Observable<any> {
    return this._httpClient.get(this._baseUrl + '/declined/all');
  }

  public getAllUserClaims(): Observable<any> {
    return this._httpClient.get(this._baseUrl + '/user/all');
  }

  public approveClaim(
    approvalData: ApproveClaimDto,
    claimId: string,
  ): Observable<any> {
    return this._httpClient.patch(
      `${this._baseUrl}/approve/${claimId}`,
      approvalData,
    );
  }

  public declineClaim(
    decliningData: DeclineClaimDto,
    claimId: string,
  ): Observable<any> {
    return this._httpClient.patch(
      `${this._baseUrl}/decline/${claimId}`,
      decliningData,
    );
  }

  public deleteClaim(claimId: string): Observable<any> {
    return this._httpClient.delete(`${this._baseUrl}/delete/${claimId}`);
  }
}
