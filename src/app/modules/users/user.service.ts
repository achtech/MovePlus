import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { PlatformService } from '../../core/services/platform.service';

export interface User {
  id?: number;
  username: string;
  email: string;
  password?: string;
  role: string;
  enabled: boolean;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  avatar?: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private platform = inject(PlatformService);
  private apiUrl = `${environment.apiUrl}/users`;
  private profileStorageKey = 'moveplus_profile_extras';

  private defaultProfileExtras: Record<string, Partial<User>> = {
    Kahlid: {
      firstName: 'Khalid',
      lastName: 'el abdallaoui',
      phone: '+212 6 00 00 00 01',
      address: 'Clinique Move+',
      avatar: 'avatar-1.jpg'
    },
    Layla: {
      firstName: 'Layla',
      lastName: 'Alaoui',
      phone: '+212 6 00 00 00 02',
      address: 'Clinique Move+',
      avatar: 'avatar-2.jpg'
    }
  };

  private profileUpdated = new Subject<User>();
  private profileOpenRequested = new Subject<void>();

  onProfileUpdated(): Observable<User> {
    return this.profileUpdated.asObservable();
  }

  notifyProfileOpen(): void {
    this.profileOpenRequested.next();
  }

  onProfileOpenRequested(): Observable<void> {
    return this.profileOpenRequested.asObservable();
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      map((users) => users.map((u) => this.mergeUser(u))),
      catchError((error) => {
        console.error('UserService error:', error);
        return of([]);
      })
    );
  }

  getUserById(id: number): Observable<User | null> {
    return this.http.get<User>(`${this.apiUrl}/${id}`).pipe(
      map((user) => this.mergeUser(user)),
      catchError((error) => {
        console.error('UserService error:', error);
        return of(null);
      })
    );
  }

  getUserByUsername(username: string): Observable<User | null> {
    return this.getUsers().pipe(map((users) => users.find((u) => u.username === username) ?? null));
  }

  resolveUser(userId: number | null, username: string | null): Observable<User | null> {
    if (userId) {
      return this.getUserById(userId).pipe(
        switchMap((user) => (user ? of(user) : username ? this.getUserByUsername(username) : of(null)))
      );
    }
    return username ? this.getUserByUsername(username) : of(null);
  }

  addUser(user: User): Observable<User> {
    const { firstName, lastName, phone, address, avatar, password, ...apiUser } = user;
    return this.http.post<User>(this.apiUrl, apiUser).pipe(
      map((created) => {
        const merged = this.mergeUser(created);
        this.saveProfileExtras(created.username, { firstName, lastName, phone, address, avatar, password });
        return merged;
      })
    );
  }

  updateUser(id: number, user: User): Observable<User> {
    const { firstName, lastName, phone, address, avatar, password, ...apiUser } = user;
    this.saveProfileExtras(user.username, {
      firstName,
      lastName,
      phone,
      address,
      avatar,
      ...(password?.trim() ? { password: password.trim() } : {})
    });

    return this.getUserById(id).pipe(
      switchMap((existing) => {
        if (!existing) {
          return throwError(() => new Error('User not found'));
        }

        const putBody: User = {
          id,
          username: apiUser.username ?? existing.username,
          email: apiUser.email ?? existing.email,
          role: apiUser.role ?? existing.role,
          enabled: apiUser.enabled ?? existing.enabled,
          password: password?.trim() ? password.trim() : existing.password
        };

        return this.http.put<User>(`${this.apiUrl}/${id}`, putBody);
      }),
      map((saved) => this.mergeUser({ ...user, ...saved, id })),
      tap((updated) => this.profileUpdated.next(updated)),
      catchError((error) => {
        console.error('UserService error:', error);
        return throwError(() => error);
      })
    );
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  resetPassword(_id: number, _newPassword?: string): Observable<void> {
    return of(void 0);
  }

  private mergeUser(user: User): User {
    const extras = this.getProfileExtras(user.username);
    const defaults = this.defaultProfileExtras[user.username] ?? {};
    const profile = { ...defaults, ...extras };

    return {
      ...profile,
      ...user,
      firstName: user.firstName ?? profile.firstName,
      lastName: user.lastName ?? profile.lastName,
      phone: user.phone ?? profile.phone,
      address: user.address ?? profile.address,
      avatar: user.avatar ?? profile.avatar
    };
  }

  private getProfileExtras(username: string): Partial<User> {
    if (!this.platform.isBrowser) {
      return this.defaultProfileExtras[username] ?? {};
    }
    try {
      const all = JSON.parse(localStorage.getItem(this.profileStorageKey) || '{}') as Record<string, Partial<User>>;
      return all[username] ?? {};
    } catch {
      return {};
    }
  }

  private saveProfileExtras(username: string, extras: Partial<User>): void {
    if (!this.platform.isBrowser) {
      return;
    }
    const all = JSON.parse(localStorage.getItem(this.profileStorageKey) || '{}') as Record<string, Partial<User>>;
    all[username] = { ...(all[username] ?? {}), ...extras };
    localStorage.setItem(this.profileStorageKey, JSON.stringify(all));
  }
}
