import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Stock {
  id?: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  minStockAlert: number;
  lastUpdated: string;
}

@Injectable({ providedIn: 'root' })
export class StockService {
  private apiUrl = `${environment.apiUrl}/stock`;

  constructor(private http: HttpClient) {}

  getStock(): Observable<Stock[]> {
    return this.http.get<Stock[]>(this.apiUrl).pipe(catchError(this.handleError([])));
  }

  addStock(stock: Stock): Observable<Stock> {
    return this.http.post<Stock>(this.apiUrl, stock);
  }

  updateStock(id: number, stock: Stock): Observable<Stock> {
    return this.http.put<Stock>(`${this.apiUrl}/${id}`, stock);
  }

  deleteStock(id: number): Observable<boolean> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      map(() => true),
      catchError(() => new Observable<boolean>((subscriber) => {
        subscriber.next(false);
        subscriber.complete();
      }))
    );
  }

  private handleError<T>(fallback: T) {
    return (error: unknown): Observable<T> => {
      console.error('StockService error:', error);
      return new Observable((subscriber) => {
        subscriber.next(fallback);
        subscriber.complete();
      });
    };
  }
}
