import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  // private attributes
  private _baseUrl = 'http://localhost:5000/api/v1/user';

  constructor(private readonly _httpClient: HttpClient) {}

  // public methods
  public getAllUsers(): Observable<any> {
    return this._httpClient.get(this._baseUrl + '/for-approvers/all');
  }

  public getAllApprovers(): Observable<any> {
    return this._httpClient.get(this._baseUrl + '/approvers/all');
  }

  public makeApprover(userId: string): Observable<any> {
    return this._httpClient.patch(
      `${this._baseUrl}/make/approver/${userId}`,
      {},
    );
  }

  public removeApprover(userId: string): Observable<any> {
    return this._httpClient.patch(
      `${this._baseUrl}/remove/approver/${userId}`,
      {},
    );
  }
}
