import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const superAdminGuard = (): CanActivateFn | boolean => {
  const authService = inject(AuthService);

  if (authService.isSuperAdmin()) {
    return true;
  }

  return false;
};
