import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AuditLog {
  id: number;
  userId?: number;
  username: string;
  topic: string;
  actionType: string;
  description: string;
  createdAt: string;
}

export interface AuditLogPage {
  content: AuditLog[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface AuditLogSearchParams {
  page?: number;
  size?: number;
  sort?: string;
  username?: string;
  topic?: string;
  description?: string;
  from?: string;
  to?: string;
}

@Injectable({ providedIn: 'root' })
export class ActivityLogService {
  private apiUrl = `${environment.apiUrl}/audit-logs`;

  constructor(private http: HttpClient) {}

  search(params: AuditLogSearchParams): Observable<AuditLogPage> {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        httpParams = httpParams.set(key, String(value));
      }
    });
    return this.http.get<AuditLogPage>(this.apiUrl, { params: httpParams });
  }
}
