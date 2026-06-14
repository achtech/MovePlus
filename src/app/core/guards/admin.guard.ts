import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { RoleService } from '../services/role.service';

export const adminGuard: CanActivateFn = () => {
  const platformId = inject(PLATFORM_ID);
  const authService = inject(AuthService);
  const roleService = inject(RoleService);
  const router = inject(Router);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  return roleService.ensureRoleLoaded().pipe(
    map((role) => (role === 'ADMIN' ? true : router.createUrlTree(['/dashboard'])))
  );
};
