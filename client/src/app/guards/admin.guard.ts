import { inject } from '@angular/core';
import { CanActivateChildFn } from '@angular/router';
import { AuthService } from '../services';

export const adminGuard: CanActivateChildFn = (route, state) => {
	return inject(AuthService).hasRole('Admin');
};
