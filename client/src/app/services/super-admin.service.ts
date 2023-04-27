import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SuperAdminService {
  // private attributes
  private _baseUrl = 'http://localhost:5000/api/v1/user';

  constructor(private readonly _httpClient: HttpClient) {}

  // public methods
  public getAllUsers(): Observable<any> {
    return this._httpClient.get(this._baseUrl + '/for-admins/all');
  }

  public getAllAdmins(): Observable<any> {
    return this._httpClient.get(this._baseUrl + '/admins/all');
  }

  public makeAdmin(userId: string): Observable<any> {
    return this._httpClient.patch(`${this._baseUrl}/grant/admin/${userId}`, {});
  }

  public removeAdmin(userId: string): Observable<any> {
    return this._httpClient.patch(
      `${this._baseUrl}/revoke/admin/${userId}`,
      {},
    );
  }

  public deleteUser(userId: string): Observable<any> {
    return this._httpClient.delete(`${this._baseUrl}/${userId}`);
  }
}
