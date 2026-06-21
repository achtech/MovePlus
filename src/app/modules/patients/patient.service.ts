import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Patient {
  id?: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  phone: string;
  email: string;
  address: string;
  medicalNotes: string;
}

export interface PatientCalendarSlot {
  slotIndex: number;
  date: string | null;
  seanceId?: number | null;
  status?: string | null;
}

export interface PatientCalendar {
  slots: PatientCalendarSlot[];
}

export interface CompteRendu {
  content: string;
}

@Injectable({ providedIn: 'root' })
export class PatientService {
  private apiUrl = `${environment.apiUrl}/patients`;

  constructor(private http: HttpClient) {}

  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.apiUrl).pipe(catchError(this.handleError([])));
  }

  getPatientById(id: number): Observable<Patient | null> {
    return this.http.get<Patient>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError(null)));
  }

  addPatient(patient: Patient): Observable<Patient> {
    return this.http.post<Patient>(this.apiUrl, patient);
  }

  updatePatient(id: number, patient: Patient): Observable<Patient> {
    return this.http.put<Patient>(`${this.apiUrl}/${id}`, patient);
  }

  deletePatient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getPatientCalendar(id: number): Observable<PatientCalendar> {
    return this.http.get<PatientCalendar>(`${this.apiUrl}/${id}/calendar`);
  }

  savePatientCalendar(id: number, calendar: PatientCalendar): Observable<PatientCalendar> {
    return this.http.put<PatientCalendar>(`${this.apiUrl}/${id}/calendar`, calendar);
  }

  getCompteRendu(id: number): Observable<CompteRendu> {
    return this.http.get<CompteRendu>(`${this.apiUrl}/${id}/compte-rendu`);
  }

  saveCompteRendu(id: number, compteRendu: CompteRendu): Observable<CompteRendu> {
    return this.http.put<CompteRendu>(`${this.apiUrl}/${id}/compte-rendu`, compteRendu);
  }

  private handleError<T>(fallback: T) {
    return (error: unknown): Observable<T> => {
      console.error('PatientService error:', error);
      return new Observable((subscriber) => {
        subscriber.next(fallback);
        subscriber.complete();
      });
    };
  }
}
