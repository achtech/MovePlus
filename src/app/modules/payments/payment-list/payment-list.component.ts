import  { Component,  OnInit  }  from '@angular/core';
import  {  MatDialog }  from  '@angular/material/dialog';
import {  PaymentService,  Payment  } from  '../payment.service';
import  { PaymentFormComponent  }  from  '../payment-form/payment-form.component';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
   selector:  'app-payment-list',
   templateUrl:  './payment-list.component.html',
   styleUrls:  ['./payment-list.component.scss'],
   standalone: true,
   imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule]
})
export class  PaymentListComponent  implements  OnInit {
    displayedColumns: string[]  =  ['patientId',  'amount', 'date',  'method',  'status',  'actions'];
   payments:  Payment[] =  [];
   totalAmount:  number  =  0;

    constructor(private paymentService:  PaymentService,  private  dialog: MatDialog)  {}

   ngOnInit():  void  {
      this.loadPayments();
    }

    loadPayments(): void  {
       this.paymentService.getPayments().subscribe(data  => {
           this.payments =  data;
          this.totalAmount  =  data.reduce((sum,  p) =>  sum  +  p.amount, 0);
       });
   }

   addPayment():  void  {
       const dialogRef  =  this.dialog.open(PaymentFormComponent,  { width:  '400px'  });
       dialogRef.afterClosed().subscribe(result =>  {
          if  (result)  this.loadPayments();
       });
   }

   editPayment(payment:  Payment): void  {
       const  dialogRef =  this.dialog.open(PaymentFormComponent,  {  width: '400px',  data:  payment  });
      dialogRef.afterClosed().subscribe(result  =>  {
          if  (result)  this.loadPayments();
      });
    }

    deletePayment(id: number):  void  {
       this.paymentService.deletePayment(id).subscribe(() =>  this.loadPayments());
   }
}
