import  {  Injectable  } from  '@angular/core';
import {  Observable, of  } from  'rxjs';

export interface  Payment  {
   id?:  number;
   patientId:  number;
   seanceId?:  number;
   amount:  number;
   date:  string;
   method:  string;
   status:  string;
}

@Injectable({  providedIn:  'root' })
export  class  PaymentService {
    private payments: Payment[] = [
        { id: 1, patientId: 1, seanceId: 1, amount: 50, date: '2026-01-15', method: 'CASH', status: 'PAID' },
        { id: 2, patientId: 2, amount: 75, date: '2026-01-16', method: 'CARD', status: 'PAID' },
        { id: 3, patientId: 3, seanceId: 3, amount: 30, date: '2026-01-17', method: 'CASH', status: 'PENDING' }
    ];

   constructor()  {}

   getPayments():  Observable<Payment[]>  {
      return  of(this.payments);
   }

   addPayment(payment:  Payment):  Observable<Payment>  {
      payment.id = this.payments.length + 1;
      this.payments.push(payment);
      return  of(payment);
   }

   updatePayment(id:  number,  payment: Payment):  Observable<Payment>  {
       const index = this.payments.findIndex(p => p.id === id);
       if (index !== -1) {
           this.payments[index] = { ...payment, id };
           return of(this.payments[index]);
       }
       return of(null as any);
   }

   deletePayment(id:  number):  Observable<void>  {
      this.payments = this.payments.filter(p => p.id !== id);
      return  of(void 0);
   }

   getPaymentsByPatientId(patientId: number): Observable<Payment[]> {
      return of(this.payments.filter(p => p.patientId === patientId));
   }

}
