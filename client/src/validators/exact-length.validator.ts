import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const exactLength = (length: number): ValidatorFn => {
	return (control: AbstractControl): ValidationErrors | null => {
		if (!control || !control.value) {
			return null;
		}

		return control.value.length === length ? null : { exactLength: true };
	};
};
