import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const userGuard = (): CanActivateFn | boolean => {
  const authService = inject(AuthService);

  if (
    !(
      authService.isAdmin() &&
      authService.isAdminApprover() &&
      authService.isUserApprover()
    )
  ) {
    return true;
  }

  return false;
};
