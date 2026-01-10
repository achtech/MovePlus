 import  {  Injectable }  from  '@angular/core';
 import {  Observable, of }  from  'rxjs';
 
export  interface  Sale  {
    id?:  number;
    productName:  string;
    quantity:  number;
    unitPrice:  number;
    total?:  number;
    saleDate:  string;
    patientId?:  number;
    soldBy:  number;
}
 
 @Injectable({  providedIn: 'root'  })
 export  class SaleService  {
    private sales: Sale[] = [
        { id: 1, productName: 'Massage Oil', quantity: 1, unitPrice: 20, total: 20, saleDate: '2026-01-15', patientId: 1, soldBy: 2 },
        { id: 2, productName: 'Therapy Ball', quantity: 2, unitPrice: 15, total: 30, saleDate: '2026-01-16', patientId: 2, soldBy: 2 },
        { id: 3, productName: 'Resistance Band', quantity: 1, unitPrice: 25, total: 25, saleDate: '2026-01-17', soldBy: 2 }
    ];

     constructor()  {}
 
    getSales():  Observable<Sale[]> {
        return  of(this.sales);
    }
 
    addSale(sale:  Sale):  Observable<Sale> {
        sale.id = this.sales.length + 1;
        sale.total = sale.quantity * sale.unitPrice;
        this.sales.push(sale);
        return  of(sale);
    }
 
    updateSale(id:  number, sale:  Sale):  Observable<Sale>  {
       const index = this.sales.findIndex(s => s.id === id);
       if (index !== -1) {
           sale.total = sale.quantity * sale.unitPrice;
           this.sales[index] = { ...sale, id };
           return of(this.sales[index]);
       }
       return of(null as any);
    }
 
    deleteSale(id:  number):  Observable<void> {
        this.sales = this.sales.filter(s => s.id !== id);
        return  of(void 0);
    }
 }
