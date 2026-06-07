import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
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
    admin: {
      firstName: 'Admin',
      lastName: 'User',
      phone: '+33 6 00 00 00 01',
      address: '12 Rue de la Santé, Paris',
      avatar: 'avatar-1.jpg'
    },
    kine1: {
      firstName: 'Marie',
      lastName: 'Dupont',
      phone: '+33 6 00 00 00 02',
      address: '45 Avenue des Champs, Lyon',
      avatar: 'avatar-2.jpg'
    },
    assistant: {
      firstName: 'Sophie',
      lastName: 'Martin',
      phone: '+33 6 00 00 00 03',
      address: '8 Boulevard Central, Marseille',
      avatar: 'avatar-3.jpg'
    },
    trainer: {
      firstName: 'Lucas',
      lastName: 'Bernard',
      phone: '+33 6 00 00 00 04',
      address: '3 Place du Sport, Toulouse',
      avatar: 'avatar-4.jpg'
    },
    Khalidovic: {
      firstName: 'Khalid',
      lastName: 'Alami',
      phone: '+33 6 00 00 00 05',
      address: '1 Clinique Move+, Casablanca',
      avatar: 'avatar-5.jpg'
    }
  };

  private profileUpdated = new Subject<User>();

  onProfileUpdated(): Observable<User> {
    return this.profileUpdated.asObservable();
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
    this.saveProfileExtras(user.username, { firstName, lastName, phone, address, avatar, password });

    return this.http.put<User>(`${this.apiUrl}/${id}`, { ...apiUser, id }).pipe(
      map((saved) => this.mergeUser({ ...user, ...saved, id })),
      tap((updated) => this.profileUpdated.next(updated)),
      catchError((error) => {
        console.error('UserService error:', error);
        return of(null as unknown as User);
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
    return { ...this.defaultProfileExtras[user.username], ...extras, ...user };
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
