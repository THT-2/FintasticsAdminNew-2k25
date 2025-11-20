import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class Authguard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      // already logged in → redirect to dashboard
      this.router.navigate(['/admin/overview'], { replaceUrl: true });
      return false;
    }
    return true; // allow access to login
  }
}
