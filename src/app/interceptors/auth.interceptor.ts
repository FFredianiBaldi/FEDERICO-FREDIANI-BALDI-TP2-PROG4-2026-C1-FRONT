import { isPlatformBrowser } from "@angular/common";
import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject, PLATFORM_ID } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);

  let clonedRequest = req;

  if(isPlatformBrowser(platformId)) {
    const data = localStorage.getItem('token');

    if(data) {

      const token = JSON.parse(data);
      clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
  }

  return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      const isAuthRoute = req.url.includes('/login') || req.url.includes('/registro') || req.url.includes('/refresh');
      if(error.status === 401 && !isAuthRoute) {
        if (isPlatformBrowser(platformId)) {
          localStorage.removeItem('token');
          localStorage.removeItem('usuario');
        }

        router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  )
}
