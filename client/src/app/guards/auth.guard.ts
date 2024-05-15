import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services';

export const authGuard: CanActivateFn = (route, state) => {
	if (inject(AuthService).isLoggedIn()) {
		return true;
	}

	inject(Router).navigate(['/login']);
	return false;
};
