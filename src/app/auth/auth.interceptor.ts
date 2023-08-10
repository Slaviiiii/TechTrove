import { Injectable } from "@angular/core";
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { Router } from "@angular/router";
import { catchError, tap } from "rxjs/operators";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.authService.isLogged()) {
      const token = this.authService.getToken();
      req = req.clone({
        setParams: {
          auth: token ?? "",
        },
      });
    }
    return next.handle(req).pipe(
      tap(() => {
        console.log("Intercept");
      }),
      catchError((error: HttpErrorResponse) => {
        console.log("[Interceptor Error]", error);
        if (error.status === 401) {
          this.authService.logoutUser();
          this.router.navigate(["login"], {
            queryParams: {
              authFailed: true,
            },
          });
        }
        if (error.status !== 401) {
          alert("Server is down, please try later!");
        }
        return throwError(error);
      })
    );
  }
}
