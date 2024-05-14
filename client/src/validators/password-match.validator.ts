import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordMatchValidator = (): ValidatorFn => {
	return (control: AbstractControl): ValidationErrors | null => {
		const passwordField = control.parent?.get('password');

		if (!passwordField?.value || !control.value) {
			return null;
		}

		return passwordField?.value === control.value
			? null
			: { passwordsDoNotMatch: true };
	};
};
