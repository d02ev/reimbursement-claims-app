import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services';

export const adminGuard: CanActivateFn = (route, state) => {
	return inject(AuthService).hasRole('Admin');
};
