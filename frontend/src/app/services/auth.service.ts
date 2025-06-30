// Generated with AI assistance - Authentication service with JWT token management
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private readonly TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'current_user';

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  /**
   * User login
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.authUrl}/login/`, credentials)
      .pipe(
        tap(response => {
          // Store tokens
          localStorage.setItem(this.TOKEN_KEY, response.tokens.access);
          localStorage.setItem(this.REFRESH_TOKEN_KEY, response.tokens.refresh);
        }),
        // Get user information immediately after storing tokens
        map(response => {
          // Get user info and store it
          this.getCurrentUser().subscribe({
            next: (user) => {
              localStorage.setItem(this.USER_KEY, JSON.stringify(user));
              this.currentUserSubject.next(user);
              console.log('User loaded after login:', user);
            },
            error: (error) => {
              console.error('Error getting user info after login:', error);
              this.clearSession();
            }
          });
          return response;
        })
      );
  }

  /**
   * User registration
   */
  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.authUrl}/register/`, userData)
      .pipe(
        tap(response => {
          localStorage.setItem(this.TOKEN_KEY, response.tokens.access);
          localStorage.setItem(this.REFRESH_TOKEN_KEY, response.tokens.refresh);
          
          // Get and store user info
          this.getCurrentUser().subscribe({
            next: (user) => {
              localStorage.setItem(this.USER_KEY, JSON.stringify(user));
              this.currentUserSubject.next(user);
            },
            error: (error) => {
              console.error('Error getting user info after registration:', error);
              this.clearSession();
            }
          });
        })
      );
  }

  /**
   * User logout - Always clears local session, attempts to invalidate server token
   */
  logout(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    
    // Always clear local session first
    this.clearSession();
    
    // Attempt to invalidate token on server (optional)
    if (refreshToken) {
      return this.http.post(`${environment.authUrl}/logout/`, { refresh: refreshToken })
        .pipe(
          catchError(error => {
            // If server logout fails, we don't care - local session is already cleared
            console.warn('Server logout failed, but local session cleared:', error);
            return of({ success: true });
          })
        );
    }
    
    // Return success observable if no refresh token
    return of({ success: true });
  }

  /**
   * Get current user information
   */
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${environment.authUrl}/me/`);
  }

  /**
   * Refresh access token
   */
  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    return this.http.post(`${environment.authUrl}/refresh/`, { refresh: refreshToken })
      .pipe(
        tap((response: any) => {
          this.setAccessToken(response.access);
        })
      );
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    const user = this.currentUserSubject.value;
    return !!token && !!user;
  }

  /**
   * Check if user is admin
   */
  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    const result = user?.role === 'admin';
    console.log('Checking isAdmin:', { user, result });
    return result;
  }

  /**
   * Check if user is applicant
   */
  isApplicant(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === 'applicant' || false;
  }

  /**
   * Get current user synchronously
   */
  getCurrentUserSync(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Set access token only (for refresh)
   */
  private setAccessToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Clear authentication session
   */
  private clearSession(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
  }

  /**
   * Load user from local storage
   */
  private loadUserFromStorage(): void {
    const userJson = localStorage.getItem(this.USER_KEY);
    const token = this.getAccessToken();
    
    if (userJson && token) {
      try {
        const user = JSON.parse(userJson);
        this.currentUserSubject.next(user);
        console.log('User loaded from storage:', user);
      } catch (e) {
        console.error('Error parsing user from storage:', e);
        this.clearSession();
      }
    }
  }
} 