import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.canActivateAdmin().pipe(
    map((isAdmin) => {
      if (isAdmin) {
        return true;
      }
      return router.createUrlTree(['/admin/login']);
    })
  );
};