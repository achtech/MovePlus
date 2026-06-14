import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface TeamMember {
  id?: number;
  photo?: string;
  fullName: string;
  phoneNumber: string;
  startDate: string;
  endDate?: string | null;
  specialty?: string;
  role: string;
  status: 'ACTIVE' | 'INACTIVE' | string;
}

@Injectable({ providedIn: 'root' })
export class TeamMemberService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/team-members`;

  getActiveTeamMembers(): Observable<TeamMember[]> {
    return this.http.get<TeamMember[]>(`${this.apiUrl}/active`).pipe(catchError(this.handleError([])));
  }

  getInactiveTeamMembers(): Observable<TeamMember[]> {
    return this.http.get<TeamMember[]>(`${this.apiUrl}/inactive`).pipe(catchError(this.handleError([])));
  }

  getTeamMemberById(id: number): Observable<TeamMember | null> {
    return this.http.get<TeamMember>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError(null)));
  }

  createTeamMember(member: TeamMember): Observable<TeamMember> {
    return this.http.post<TeamMember>(this.apiUrl, member);
  }

  updateTeamMember(id: number, member: TeamMember): Observable<TeamMember> {
    return this.http.put<TeamMember>(`${this.apiUrl}/${id}`, { ...member, id });
  }

  deleteTeamMember(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  activateTeamMember(id: number): Observable<TeamMember> {
    return this.http.patch<TeamMember>(`${this.apiUrl}/${id}/activate`, {});
  }

  deactivateTeamMember(id: number): Observable<TeamMember> {
    return this.http.patch<TeamMember>(`${this.apiUrl}/${id}/deactivate`, {});
  }

  private handleError<T>(fallback: T) {
    return (error: unknown): Observable<T> =>
      new Observable((subscriber) => {
        console.error('TeamMemberService error:', error);
        subscriber.next(fallback);
        subscriber.complete();
      });
  }
}
