import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export type NotificationCategory = 'WARNING' | 'PAYMENT' | 'SUCCESS';

export type NotificationType =
  | 'PACK_LOW'
  | 'PACK_EXHAUSTED'
  | 'PACK_PURCHASED'
  | 'PAYMENT_PENDING'
  | 'PAYMENT_COMPLETED'
  | 'EXPENSE_NEW'
  | 'STOCK_LOW';

export interface AppNotification {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  category: NotificationCategory;
  read: boolean;
  patientId?: number;
  entityType?: string;
  entityId?: number;
  linkRoute?: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private apiUrl = `${environment.apiUrl}/notifications`;

  constructor(private http: HttpClient) {}

  getNotifications(): Observable<AppNotification[]> {
    return this.http.get<AppNotification[]>(this.apiUrl).pipe(catchError(this.handleError([])));
  }

  getUnreadCount(): Observable<number> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/unread-count`).pipe(
      map((res) => res.count ?? 0),
      catchError(this.handleError(0))
    );
  }

  markAsRead(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/read`, {});
  }

  markAllAsRead(): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/read-all`, {});
  }

  clearAll(): Observable<void> {
    return this.http.delete<void>(this.apiUrl);
  }

  /** Icon class (Feather) per notification category. */
  iconFor(category: NotificationCategory): string {
    switch (category) {
      case 'WARNING':
        return 'icon-alert-triangle';
      case 'PAYMENT':
        return 'icon-credit-card';
      case 'SUCCESS':
        return 'icon-check-circle';
      default:
        return 'icon-bell';
    }
  }

  private handleError<T>(fallback: T) {
    return (error: unknown): Observable<T> => {
      console.error('NotificationService error:', error);
      return new Observable((subscriber) => {
        subscriber.next(fallback);
        subscriber.complete();
      });
    };
  }
}
