import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
	FetchUserDetailsResponseDto,
	LoginUserRequestDto,
	LoginUserResponseDto,
	LogoutUserResponseDto,
	RegisterUserRequestDto,
	RegisterUserResponseDto,
} from '../../dtos';
import { jwtDecode } from 'jwt-decode';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	private readonly _authUrl = environment.apiUrl + '/auth';

	constructor(private readonly _httpClient: HttpClient) {}

	// register a user
	register(
		registerUserRequestDto: RegisterUserRequestDto,
	): Observable<RegisterUserResponseDto> {
		return this._httpClient.post<RegisterUserResponseDto>(
			this._authUrl + '/register',
			registerUserRequestDto,
		);
	}

	// login a user
	login(
		loginUserRequestDto: LoginUserRequestDto,
	): Observable<LoginUserResponseDto> {
		return this._httpClient.post<LoginUserResponseDto>(
			this._authUrl + '/login',
			loginUserRequestDto,
		);
	}

	// logout a user
	logout(): Observable<LogoutUserResponseDto> {
		return this._httpClient.post<LogoutUserResponseDto>(
			this._authUrl + '/logout',
			{},
		);
	}

	// get logged in user details
	fetchMe(): Observable<FetchUserDetailsResponseDto> {
		return this._httpClient.get<FetchUserDetailsResponseDto>(
			this._authUrl + '/me',
		);
	}

	// utility methods
	getAccessToken(): string | undefined | null {
		return window.localStorage.getItem('accessToken');
	}

	isLoggedIn(): boolean {
		return !!window.localStorage.getItem('user');
	}

	hasRole(role: 'User' | 'Admin'): boolean {
		const user = window.localStorage.getItem('user');
		return user && JSON.parse(user)['role'] === role ? true : false;
	}
}
