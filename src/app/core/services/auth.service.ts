import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user?: {
    id: number;
    username: string;
    email: string;
    role?: string;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private tokenKey = 'auth_token';
  private roleKey = 'auth_role';
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  login(credentials: LoginRequest): Observable<AuthResponse | string> {
    return this.http.post(`${this.apiUrl}/login`, credentials, {
      observe: 'response' as const,
      responseType: 'text' as const,
      withCredentials: true
    }).pipe(
      map((httpResponse: HttpResponse<string>) => {
        const body = httpResponse.body ?? '';
        console.log('Login response:', { status: httpResponse.status, bodyLength: body.length, firstChars: body.substring(0, 100) });

        // Try to parse as JSON first
        try {
          const response = JSON.parse(body) as AuthResponse;
          console.log('Parsed JSON response:', response);
          if (response?.token) {
            this.saveToken(response.token);
          }
          if (response?.user?.role) {
            this.storeRole(response.user.role);
          }
          return response;
        } catch (e) {
          console.log('JSON parse failed:', e);
          // If JSON parse fails, check if it's HTML (indicating successful redirect)
          if (body.startsWith('<') || httpResponse.status === 200) {
            // Backend redirected to dashboard (status 200 after following redirect)
            // This indicates successful authentication
            console.log('Detected successful redirect, creating synthetic token');
            const syntheticToken = 'redirect_' + Date.now();
            this.saveToken(syntheticToken);
            return { token: syntheticToken } as AuthResponse;
          }
          
          // If not JSON and not HTML, it's an error
          console.log('Not JSON and not HTML, throwing error');
          throw new Error('Login failed: Invalid response from server');
        }
      })
    );
  }

  register(user: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, user).pipe(
      tap((response) => {
        if (response.token) {
          this.saveToken(response.token);
        }
        if (response.user?.role) {
          this.storeRole(response.user.role);
        }
      })
    );
  }

  saveToken(token: string): void {
    if (this.isBrowser) {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  getToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.roleKey);
    }
  }

  storeRole(role: string): void {
    if (this.isBrowser) {
      localStorage.setItem(this.roleKey, role);
    }
  }

  getStoredRole(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem(this.roleKey);
    }
    return null;
  }

  clearStoredRole(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.roleKey);
    }
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiration = payload.exp * 1000;
      return Date.now() < expiration;
    } catch (e) {
      return false;
    }
  }

  getCurrentUserId(): number | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || null;
    } catch (e) {
      return null;
    }
  }

  getCurrentUsername(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || null;
    } catch (e) {
      return null;
    }
  }
}
