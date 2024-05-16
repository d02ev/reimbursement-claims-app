import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import {
	ReactiveFormsModule,
	FormBuilder,
	FormControl,
	FormGroup,
	Validators,
	AbstractControl,
} from '@angular/forms';
import {
	FetchUserDetailsResponseDto,
	LoginUserRequestDto,
	LoginUserResponseDto,
} from '../../../dtos';
import { RequestStatusType } from '../../../enums';
import { AuthService } from '../../services';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [CommonModule, RouterLink, RouterLinkActive, ReactiveFormsModule],
	templateUrl: './login.component.html',
	styleUrl: './login.component.css',
})
export class LoginComponent {
	userLoginRequestStatus = {
		type: RequestStatusType.NONE,
		message: '',
	};

	constructor(
		private readonly _formBuilder: FormBuilder,
		private readonly _router: Router,
		private readonly _authService: AuthService,
	) {}

	userLoginForm: FormGroup = this._formBuilder.group({
		email: new FormControl('', [Validators.required, Validators.email]),
		password: new FormControl('', [Validators.required]),
	});

	submitUserLoginForm(event: SubmitEvent): void {
		event.preventDefault();
		const loginUserRequestDto: LoginUserRequestDto = {
			...this.userLoginForm.value,
		};

		this._authService.login(loginUserRequestDto).subscribe({
			next: (response: LoginUserResponseDto) => {
				window.localStorage.setItem('accessToken', response.accessToken);
				window.localStorage.setItem('refreshToken', response.refreshToken);

				this._authService.fetchMe().subscribe({
					next: (response: FetchUserDetailsResponseDto) => {
						window.localStorage.setItem('user', JSON.stringify(response));

						this.setUserLoginRequestStatus(
							RequestStatusType.SUCCESS,
							'User logged in successfully.',
						);
					},
					complete: () => {
						if (this._authService.hasRole('Admin')) {
							this._router.navigate(['/admin/home']);
						} else if (this._authService.hasRole('User')) {
							this._router.navigate(['user/home']);
						}
					},
				});
			},
			error: (error: HttpErrorResponse) => {
				if (error.status === 401) {
					this.setUserLoginRequestStatus(
						RequestStatusType.ERROR,
						'Invalid credentials',
					);
				}

				this.setUserLoginRequestStatus(RequestStatusType.ERROR, error.message);
			},
		});
	}

	getUserLoginFormControl(controlName: string): AbstractControl | null {
		return this.userLoginForm.get(controlName);
	}

	getUserLoginFormControlState(controlName: string): {
		[key: string]: boolean | undefined;
	} {
		const formControlName = this.getUserLoginFormControl(controlName);
		return {
			isInvalid: formControlName?.invalid,
			isTouched: formControlName?.touched,
			isDirty: formControlName?.dirty,
			isTouchedOrDirty: formControlName?.touched || formControlName?.dirty,
			isInvalidAndTouched: formControlName?.invalid && formControlName?.touched,
			isValidAndTouched: !formControlName?.invalid && formControlName?.touched,
		};
	}

	getUserLoginFormControlError(
		controlName: string,
		validationErrorType: string,
	): boolean | undefined | null {
		return (
			this.userLoginForm.get(controlName)?.hasError(validationErrorType) ||
			this.userLoginForm.errors?.[validationErrorType]
		);
	}

	setUserLoginRequestStatus(type: RequestStatusType, message: string): void {
		this.userLoginRequestStatus = { type, message };
	}

	resetUserLoginRequestError(): void {
		this.userLoginRequestStatus = {
			type: RequestStatusType.NONE,
			message: '',
		};
	}
}
