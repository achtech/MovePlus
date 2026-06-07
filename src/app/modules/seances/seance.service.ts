import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Seance {
  id?: number;
  patientId: number;
  therapistId: number;
  dateTime: string;
  duration: number;
  type: string;
  notes: string;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class SeanceService {
  private apiUrl = `${environment.apiUrl}/seances`;

  constructor(private http: HttpClient) {}

  getSeances(): Observable<Seance[]> {
    return this.http.get<Seance[]>(this.apiUrl).pipe(catchError(this.handleError([])));
  }

  addSeance(seance: Seance): Observable<Seance> {
    return this.http.post<Seance>(this.apiUrl, seance);
  }

  updateSeance(id: number, seance: Seance): Observable<Seance> {
    return this.http.put<Seance>(`${this.apiUrl}/${id}`, seance);
  }

  deleteSeance(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getSeancesByPatientId(patientId: number): Observable<Seance[]> {
    return this.http.get<Seance[]>(`${this.apiUrl}/patient/${patientId}`).pipe(catchError(this.handleError([])));
  }

  private handleError<T>(fallback: T) {
    return (error: unknown): Observable<T> => {
      console.error('SeanceService error:', error);
      return new Observable((subscriber) => {
        subscriber.next(fallback);
        subscriber.complete();
      });
    };
  }
}
