import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginDto, RegisterDto } from '../shared/dto/user';
import { Role } from '../shared/enum';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // private attributes
  private _baseUrl = 'http://localhost:5000/api/v1/auth';

  constructor(private readonly _httpClient: HttpClient) {}

  // public methods
  public registerUser(registrationData: RegisterDto): Observable<any> {
    return this._httpClient.post(this._baseUrl + '/register', registrationData);
  }

  public loginUser(loginData: LoginDto): Observable<any> {
    return this._httpClient.post(this._baseUrl + '/login', loginData);
  }

  public logoutUser(): void {
    sessionStorage.removeItem('access_token');
    window.location.reload();
  }

  public getPayloadValueOf(key: string): any {
    const decodedJwtData = this._decodeJwtToken(this._getJwtToken());
    return decodedJwtData[key];
  }

  public isUserLoggedIn(): boolean {
    return !!this._getJwtToken();
  }

  public isSuperAdmin(): boolean {
    const userRoles: Role[] = this.getPayloadValueOf('roles');

    if (this.isUserLoggedIn() && userRoles.includes(Role.SUPER_ADMIN)) {
      return true;
    }

    return false;
  }

  public isAdmin(): boolean {
    const userRoles: Role[] = this.getPayloadValueOf('roles');

    if (this.isUserLoggedIn() && userRoles.includes(Role.ADMIN)) {
      return true;
    }

    return false;
  }

  public isUserApprover(): boolean {
    const userRoles: Role[] = this.getPayloadValueOf('roles');

    if (
      this.isUserLoggedIn() &&
      userRoles.includes(Role.USER) &&
      userRoles.includes(Role.APPROVER)
    ) {
      return true;
    }

    return false;
  }

  public isAdminApprover(): boolean {
    const userRoles: Role[] = this.getPayloadValueOf('roles');

    if (
      this.isUserLoggedIn() &&
      userRoles.includes(Role.ADMIN) &&
      userRoles.includes(Role.APPROVER)
    ) {
      return true;
    }

    return false;
  }

  // private methods
  private _decodeJwtToken(jwtToken: string): any {
    const jwtData = jwtToken.split('.')[1];
    const decodedJwtJsonData = window.atob(jwtData);
    const decodedJwtData = JSON.parse(decodedJwtJsonData);

    return decodedJwtData;
  }

  private _getJwtToken(): string {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return sessionStorage.getItem('access_token')!;
  }
}
