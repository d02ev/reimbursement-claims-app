import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateClaimDto } from '../shared/dto/claims';

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

  public getAllUserClaims(): Observable<any> {
    return this._httpClient.get(this._baseUrl + '/user/all');
  }

  public deleteClaim(claimId: string): Observable<any> {
    return this._httpClient.delete(`${this._baseUrl}/delete/${claimId}`);
  }
}
