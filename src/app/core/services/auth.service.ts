import  {  Injectable, Inject, PLATFORM_ID  } from  '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import  { HttpClient  }  from  '@angular/common/http';
import  {  Observable  } from  'rxjs';
import { tap } from 'rxjs/operators';

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
   };
}

@Injectable({ providedIn:  'root'  })
export class  AuthService  {
   private  apiUrl  = 'http://localhost:8080/api/auth';
    private tokenKey  =  'auth_token';
    private isBrowser: boolean;

   constructor(
       private  http: HttpClient,
       @Inject(PLATFORM_ID) platformId: Object
   )  {
       this.isBrowser = isPlatformBrowser(platformId);
   }

   login(credentials: LoginRequest): Observable<AuthResponse>  {
       return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
           tap(response => {
               if (response.token) {
                   this.saveToken(response.token);
               }
           })
       );
    }

    register(user: RegisterRequest): Observable<AuthResponse>  {
       return this.http.post<AuthResponse>(`${this.apiUrl}/register`, user).pipe(
           tap(response => {
               if (response.token) {
                   this.saveToken(response.token);
               }
           })
       );
    }

    saveToken(token: string):  void  {
       if (this.isBrowser) {
           localStorage.setItem(this.tokenKey, token);
       }
    }

    getToken(): string  |  null  {
      if (this.isBrowser) {
          return  localStorage.getItem(this.tokenKey);
      }
      return null;
   }

   logout():  void  {
       if (this.isBrowser) {
           localStorage.removeItem(this.tokenKey);
       }
   }

   isAuthenticated():  boolean {
      const token = this.getToken();
      if (!token) return false;
      
      try {
         const payload = JSON.parse(atob(token.split('.')[1]));
         const expiration = payload.exp * 1000; // Convert to milliseconds
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
