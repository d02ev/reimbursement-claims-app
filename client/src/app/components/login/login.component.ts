import { Component } from '@angular/core';
import { RequestStatusType } from '../../../enums';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
	ReactiveFormsModule,
	FormBuilder,
	FormControl,
	FormGroup,
	Validators,
	AbstractControl,
} from '@angular/forms';

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

	constructor(private readonly _formBuilder: FormBuilder) {}

	userLoginForm: FormGroup = this._formBuilder.group({
		email: new FormControl('', [Validators.required, Validators.email]),
		password: new FormControl('', [Validators.required]),
	});

	submitUserLoginForm(): void {}

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
