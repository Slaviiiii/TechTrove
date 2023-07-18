// import { Injectable } from "@angular/core";
// import {
//   ActivatedRouteSnapshot,
//   RouterStateSnapshot,
//   UrlTree,
//   Router,
//   CanActivateFn,
// } from "@angular/router";
// import { Observable } from "rxjs";
// import { AuthService } from "src/app/user/auth.service";

// @Injectable({
//   providedIn: "root",
// })
// export class AuthGuard implements CanActivateFn {
//   constructor(private authService: AuthService, private router: Router) {}

//   canActivate(
//     next: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
//   ):
//     | Observable<boolean | UrlTree>
//     | Promise<boolean | UrlTree>
//     | boolean
//     | UrlTree {
//     return this.canActivateFn(next, state);
//   }

//   canActivateFn(
//     next: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
//   ): boolean | UrlTree {
//     const isAuthenticated = this.authService.isAuthenticated();

//     if (isAuthenticated) {
//       return true;
//     } else {
//       return this.router.createUrlTree(["/login"]);
//     }
//   }
// }
