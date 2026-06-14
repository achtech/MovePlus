import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { UserService } from '../../modules/users/user.service';

@Injectable({ providedIn: 'root' })
export class RoleService {
  private auth = inject(AuthService);
  private users = inject(UserService);

  private role: string | null = null;
  private loading?: Observable<string | null>;

  ensureRoleLoaded(): Observable<string | null> {
    if (this.role) {
      return of(this.role);
    }

    const stored = this.auth.getStoredRole();
    if (stored) {
      this.role = stored;
      return of(stored);
    }

    if (this.loading) {
      return this.loading;
    }

    this.loading = this.users
      .resolveUser(this.auth.getCurrentUserId(), this.auth.getCurrentUsername())
      .pipe(
        map((user) => user?.role ?? null),
        tap((role) => {
          this.role = role;
          if (role) {
            this.auth.storeRole(role);
          }
          this.loading = undefined;
        }),
        catchError(() => {
          this.loading = undefined;
          return of(null);
        })
      );

    return this.loading;
  }

  getRole(): string | null {
    return this.role ?? this.auth.getStoredRole();
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }

  clear(): void {
    this.role = null;
    this.loading = undefined;
    this.auth.clearStoredRole();
  }
}
