import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const authguradGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Check if we're running in the browser
  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('token');

    //  Case 1: User NOT logged in and tries to access a protected route
     if (!token && state.url.startsWith('/admin')) {
      router.navigate(['/login'], { replaceUrl: true });
      return false;
    }
    //  Case 2: User IS logged in and tries to go back to login
    if (token && state.url === '/login') {
      router.navigate(['/admin/overview'], { replaceUrl: true });
      return false;
    }
    return true; // allow everything else
  }
  // If on server, don't allow navigation (or handle as needed)
  return false;
};
