// Generated with AI assistance - HTTP interceptor for JWT token management
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add authorization header with JWT token if available
    const token = this.authService.getAccessToken();
    
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token expired, try to refresh
          return this.handle401Error(request, next);
        }
        return throwError(() => error);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.authService.getRefreshToken()) {
      return this.authService.refreshToken().pipe(
        switchMap(() => {
          const newToken = this.authService.getAccessToken();
          if (newToken) {
            request = request.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`
              }
            });
            return next.handle(request);
          }
          return throwError(() => new Error('Token refresh failed'));
        }),
        catchError((error) => {
          // Refresh failed, logout user
          this.authService.logout().subscribe();
          this.router.navigate(['/login']);
          return throwError(() => error);
        })
      );
    } else {
      // No refresh token, logout user
      this.authService.logout().subscribe();
      this.router.navigate(['/login']);
      return throwError(() => new Error('No refresh token available'));
    }
  }
} 