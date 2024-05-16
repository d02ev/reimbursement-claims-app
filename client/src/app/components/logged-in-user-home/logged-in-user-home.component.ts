import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services';
import { LogoutUserResponseDto } from '../../../dtos';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
	selector: 'app-logged-in-user-home',
	standalone: true,
	imports: [RouterOutlet, RouterLink, RouterLinkActive],
	templateUrl: './logged-in-user-home.component.html',
	styleUrl: './logged-in-user-home.component.css',
})
export class LoggedInUserHomeComponent implements OnInit {
	loggedInUserName: string = '';

	constructor(private readonly _authService: AuthService) {}

	ngOnInit(): void {
		const user = JSON.parse(window.localStorage.getItem('user')!);
		this.loggedInUserName = user.name;
	}

	logout() {
		this._authService.logout().subscribe({
			next: (response: LogoutUserResponseDto) => {
				window.localStorage.clear();
				window.location.reload();
			},
			error: (error: HttpErrorResponse) => {},
		});
	}
}
