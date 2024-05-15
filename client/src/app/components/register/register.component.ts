import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
	ReactiveFormsModule,
	FormBuilder,
	FormControl,
	FormGroup,
	Validators,
	AbstractControl,
} from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { BankName, RequestStatusType } from '../../../enums';
import { exactLength, passwordMatchValidator } from '../../../validators';
import { AuthService } from '../../services';
import { RegisterUserRequestDto, RegisterUserResponseDto } from '../../../dtos';

@Component({
	selector: 'app-register',
	standalone: true,
	imports: [CommonModule, RouterLink, RouterLinkActive, ReactiveFormsModule],
	templateUrl: './register.component.html',
	styleUrl: './register.component.css',
})
export class RegisterComponent {
	userRegistrationRequestStatus = {
		type: RequestStatusType.NONE,
		message: '',
	};

	readonly bankNames = BankName;

	private readonly _fullNameRegex = /^[a-zA-Z\s]+$/;
	private readonly _bankAccNumRegex = /^\d+$/;
	private readonly _ifscRegex = /^[A-Z]+[0][A-Z0-9]+$/;
	private readonly _panRegex = /^[A-Z]+\d+[A-Z]+$/;
	private readonly _passwordRegex =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

	constructor(
		private readonly _formBuilder: FormBuilder,
		private readonly _router: Router,
		private readonly _authService: AuthService,
	) {}

	userRegistrationForm: FormGroup = this._formBuilder.group({
		fullName: new FormControl('', [
			Validators.required,
			Validators.pattern(this._fullNameRegex),
		]),
		email: new FormControl('', [Validators.required, Validators.email]),
		bankName: new FormControl('', [Validators.required]),
		ifsc: new FormControl('', [
			Validators.required,
			exactLength(11),
			Validators.pattern(this._ifscRegex),
		]),
		bankAccNum: new FormControl('', [
			Validators.required,
			exactLength(12),
			Validators.pattern(this._bankAccNumRegex),
		]),
		pan: new FormControl('', [
			Validators.required,
			exactLength(10),
			Validators.pattern(this._panRegex),
		]),
		password: new FormControl('', [
			Validators.required,
			Validators.minLength(8),
			Validators.maxLength(15),
			Validators.pattern(this._passwordRegex),
		]),
		confirmPassword: new FormControl('', [
			Validators.required,
			passwordMatchValidator(),
		]),
	});

	submitUserRegistrationForm(event: SubmitEvent): void {
		event.preventDefault();
		const registerUserRequestDto: RegisterUserRequestDto = {
			...this.userRegistrationForm.value,
		};

		this._authService.register(registerUserRequestDto).subscribe({
			next: (response: RegisterUserResponseDto) => {
				this.setUserRegistrationRequestStatus(
					RequestStatusType.SUCCESS,
					response.message,
				);
			},
			error: (error: Error) => {
				this.setUserRegistrationRequestStatus(
					RequestStatusType.ERROR,
					error.message,
				);
			},
			complete: () => {
				setTimeout(() => {
					this.resetUserRegistrationRequestStatus();
					this.routeToLoginPage();
				}, 3000);
			},
		});
	}

	getUserRegistrationFormControl(controlName: string): AbstractControl | null {
		return this.userRegistrationForm.get(controlName);
	}

	getUserRegistrationFormControlState(controlName: string): {
		[key: string]: boolean | undefined;
	} {
		const formControlName = this.userRegistrationForm.get(controlName);
		return {
			isInvalid: formControlName?.invalid,
			isTouched: formControlName?.touched,
			isDirty: formControlName?.dirty,
			isTouchedOrDirty: formControlName?.touched || formControlName?.dirty,
			isInvalidAndTouched: formControlName?.invalid && formControlName?.touched,
			isValidAndTouched: !formControlName?.invalid && formControlName?.touched,
		};
	}

	getUserRegistrationFormControlError(
		controlName: string,
		validationErrorType: string,
	): boolean | undefined | null {
		return (
			this.userRegistrationForm
				.get(controlName)
				?.hasError(validationErrorType) ||
			this.userRegistrationForm.errors?.[validationErrorType]
		);
	}

	setUserRegistrationRequestStatus(
		type: RequestStatusType,
		message: string,
	): void {
		this.userRegistrationRequestStatus = {
			type,
			message,
		};
	}

	resetUserRegistrationRequestStatus(): void {
		this.userRegistrationRequestStatus = {
			type: RequestStatusType.NONE,
			message: '',
		};
	}

	routeToLoginPage(): void {
		this._router.navigate(['/login']);
	}
}
