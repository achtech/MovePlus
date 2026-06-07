import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Sale {
  id?: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  total?: number;
  saleDate: string;
  patientId?: number;
  soldBy: number;
  notes?: string;
}

@Injectable({ providedIn: 'root' })
export class SaleService {
  private apiUrl = `${environment.apiUrl}/sales`;

  constructor(private http: HttpClient) {}

  getSales(): Observable<Sale[]> {
    return this.http.get<Sale[]>(this.apiUrl).pipe(catchError(this.handleError([])));
  }

  addSale(sale: Sale): Observable<Sale> {
    return this.http.post<Sale>(this.apiUrl, {
      ...sale,
      total: sale.quantity * sale.unitPrice
    });
  }

  updateSale(id: number, sale: Sale): Observable<Sale> {
    return this.http.put<Sale>(`${this.apiUrl}/${id}`, {
      ...sale,
      total: sale.quantity * sale.unitPrice
    });
  }

  deleteSale(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private handleError<T>(fallback: T) {
    return (error: unknown): Observable<T> => {
      console.error('SaleService error:', error);
      return new Observable((subscriber) => {
        subscriber.next(fallback);
        subscriber.complete();
      });
    };
  }
}
