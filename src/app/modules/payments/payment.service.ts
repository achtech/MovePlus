import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Payment {
  id?: number;
  patientId: number;
  seanceId?: number;
  amount: number;
  date: string;
  paymentDate?: string;
  method: string;
  status: string;
}

type ApiPayment = Omit<Payment, 'date'> & { paymentDate?: string; date?: string };

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) {}

  getPayments(): Observable<Payment[]> {
    return this.http.get<ApiPayment[]>(this.apiUrl).pipe(
      map((items) => items.map((p) => this.fromApi(p))),
      catchError(this.handleError([]))
    );
  }

  addPayment(payment: Payment): Observable<Payment> {
    return this.http.post<ApiPayment>(this.apiUrl, this.toApi(payment)).pipe(map((p) => this.fromApi(p)));
  }

  updatePayment(id: number, payment: Payment): Observable<Payment> {
    return this.http.put<ApiPayment>(`${this.apiUrl}/${id}`, this.toApi(payment)).pipe(map((p) => this.fromApi(p)));
  }

  deletePayment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getPaymentsByPatientId(patientId: number): Observable<Payment[]> {
    return this.http.get<ApiPayment[]>(`${this.apiUrl}/patient/${patientId}`).pipe(
      map((items) => items.map((p) => this.fromApi(p))),
      catchError(this.handleError([]))
    );
  }

  private fromApi(payment: ApiPayment): Payment {
    return {
      ...payment,
      date: payment.date || payment.paymentDate || ''
    };
  }

  private toApi(payment: Payment): ApiPayment {
    const { date, ...rest } = payment;
    return {
      ...rest,
      paymentDate: date || payment.paymentDate || ''
    };
  }

  private handleError<T>(fallback: T) {
    return (error: unknown): Observable<T> => {
      console.error('PaymentService error:', error);
      return new Observable((subscriber) => {
        subscriber.next(fallback);
        subscriber.complete();
      });
    };
  }
}
