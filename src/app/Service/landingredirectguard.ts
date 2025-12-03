// import { Injectable } from '@angular/core';
// import {
//   CanActivate,
//   ActivatedRouteSnapshot,
//   RouterStateSnapshot,
//   Router,
//   UrlTree
// } from '@angular/router';
// import { Authguard } from '../constants/authguard';

// @Injectable({ providedIn: 'root' })
// export class Landingredirectguard implements CanActivate {

//   constructor(
//     private router: Router,
//     private authService: Authguard
//   ) {}

//   canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
//   ): UrlTree {

//     // const userPermissions = this.authService.getCurrentUserPermissions();

//     // Find the first nav item / subtitle the user is allowed to see
//     const defaultPath = this.getDefaultPathFromNav(userPermissions);

//     // Fallback if something goes wrong
//     return this.router.parseUrl(defaultPath || '/login');
//   }

//   private getDefaultPathFromNav(perms: any): string | null {
//     // Example: check your NavItems against permissions

//     for (const item of NavItems) {
//       // skip whole module if user doesn't have access
//       if (!this.hasAccessToModule(perms, item.id)) {
//         continue;
//       }

//       for (const sub of item.subtitle || []) {
//         if (this.hasAccessToRoute(perms, sub.id)) {
//           // this becomes default landing route
//           return sub.path;
//         }
//       }
//     }

//     return null;
//   }

//   private hasAccessToModule(perms: any, moduleId: string): boolean {
//     // Implement your own logic
//     // e.g. return perms.modules.includes(moduleId);
//     return true;
//   }

//   private hasAccessToRoute(perms: any, routeId: string): boolean {
//     // Implement your own logic
//     // e.g. return perms.routes.includes(routeId);
//     return true;
//   }
// }
