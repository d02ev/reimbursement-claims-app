import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services';

export const userGuard: CanActivateFn = (route, state) => {
	return inject(AuthService).hasRole('User');
};
