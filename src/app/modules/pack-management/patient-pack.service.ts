import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface PatientPack {
  id?: number;
  patientId: number;
  packId: number;
  packName?: string;
  patientFirstName?: string;
  patientLastName?: string;
  purchaseDate: string;
  agreedPrice: number;
  priceType: 'MAISON' | 'CABINET';
  totalSessions: number;
  remainingSessions: number;
  paymentStatus: 'PAID' | 'IN_PROGRESS' | 'PENDING';
  subscriptionStatus: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  amountPaid?: number;
  amountRemaining?: number;
}

export interface AssignPatientPackRequest {
  patientId: number;
  packId: number;
  purchaseDate?: string;
  priceType: 'MAISON' | 'CABINET';
}

export interface PackDepositRequest {
  amount: number;
  method: string;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class PatientPackService {
  private apiUrl = `${environment.apiUrl}/patient-packs`;

  constructor(private http: HttpClient) {}

  getActiveSubscriberCounts(): Observable<Record<number, number>> {
    return this.http.get<Record<number, number>>(`${this.apiUrl}/stats/active-counts`).pipe(
      catchError(() => of({}))
    );
  }

  getActiveSubscribersByPack(packId: number): Observable<PatientPack[]> {
    return this.http.get<PatientPack[]>(`${this.apiUrl}/pack/${packId}/active`).pipe(
      catchError(() => of([]))
    );
  }

  getActivePackForPatient(patientId: number): Observable<PatientPack | null> {
    return this.http
      .get<PatientPack>(`${this.apiUrl}/patient/${patientId}/active`, { observe: 'response' })
      .pipe(
        map((res) => (res.status === 204 || !res.body ? null : res.body)),
        catchError(() => of(null))
      );
  }

  getPacksForPatient(patientId: number): Observable<PatientPack[]> {
    return this.http.get<PatientPack[]>(`${this.apiUrl}/patient/${patientId}`).pipe(
      catchError(() => of([]))
    );
  }

  assignPack(request: AssignPatientPackRequest): Observable<PatientPack> {
    return this.http.post<PatientPack>(this.apiUrl, request);
  }

  recordDeposit(patientPackId: number, request: PackDepositRequest): Observable<PatientPack> {
    return this.http.post<PatientPack>(`${this.apiUrl}/${patientPackId}/deposit`, request);
  }

  cancelSubscription(patientPackId: number): Observable<PatientPack> {
    return this.http.post<PatientPack>(`${this.apiUrl}/${patientPackId}/cancel`, {});
  }
}
