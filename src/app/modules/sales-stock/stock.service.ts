import {  Injectable  }  from '@angular/core';
import {  Observable, of  }  from 'rxjs';

export  interface Stock  {
   id?:  number;
   productName:  string;
   quantity:  number;
   unitPrice:  number;
   minStockAlert:  number;
   lastUpdated:  string;
}

@Injectable({  providedIn:  'root'  })
export  class  StockService  {
   private stock: Stock[] = [
       { id: 1, productName: 'Massage Oil', quantity: 50, unitPrice: 20, minStockAlert: 10, lastUpdated: '2026-01-10' },
       { id: 2, productName: 'Therapy Ball', quantity: 30, unitPrice: 15, minStockAlert: 5, lastUpdated: '2026-01-09' },
       { id: 3, productName: 'Resistance Band', quantity: 20, unitPrice: 25, minStockAlert: 3, lastUpdated: '2026-01-08' }
   ];

   constructor() {}

   getStock():  Observable<Stock[]>  {
       return of(this.stock);
    }

    addStock(stock: Stock): Observable<Stock> {
       const newId = Math.max(...this.stock.map(s => s.id || 0)) + 1;
       const newStock = { ...stock, id: newId, lastUpdated: new Date().toISOString().split('T')[0] };
       this.stock.push(newStock);
       return of(newStock);
   }

    updateStock(id: number,  stock:  Stock):  Observable<Stock> {
       const index = this.stock.findIndex(s => s.id === id);
       if (index !== -1) {
           this.stock[index] = { ...stock, id };
           return of(this.stock[index]);
       }
       return of(null as any);
   }

   deleteStock(id: number): Observable<boolean> {
       const index = this.stock.findIndex(s => s.id === id);
       if (index !== -1) {
           this.stock.splice(index, 1);
           return of(true);
       }
       return of(false);
   }
}
