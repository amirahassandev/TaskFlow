import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  const role = authService.userRole();

  if (role === 'admin') {
    return true;
  }

  toastr.warning('You do not have permission to access that area.', 'Access Denied');
  
  if (role === 'user') {
    return router.parseUrl('/tasks');
  }
  
  return router.parseUrl('/login');
};
