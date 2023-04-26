import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const approverGuard = (): CanActivateFn | boolean => {
  const authService = inject(AuthService);

  if (authService.isUserApprover() || authService.isAdminApprover()) {
    return true;
  }

  return false;
};
