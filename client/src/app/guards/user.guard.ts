import { inject } from '@angular/core';
import { CanActivateChildFn } from '@angular/router';
import { AuthService } from '../services';

export const userGuard: CanActivateChildFn = (route, state) => {
	return inject(AuthService).hasRole('User');
};
