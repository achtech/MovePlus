import  { Component,  OnInit  }  from '@angular/core';
import  {  MatDialog }  from  '@angular/material/dialog';
import {  PaymentService,  Payment  } from  '../payment.service';
import  { PaymentFormComponent  }  from  '../payment-form/payment-form.component';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { CardComponent } from '../../../theme/shared/components/card/card.component';

@Component({
   selector:  'app-payment-list',
   templateUrl:  './payment-list.component.html',
   styleUrls:  ['./payment-list.component.scss'],
   standalone: true,
   imports: [CommonModule, TableModule, ButtonModule, InputTextModule, IconFieldModule, InputIconModule, TagModule, CardComponent]
})
export class  PaymentListComponent  implements  OnInit {
   payments:  Payment[] =  [];
   totalAmount:  number  =  0;
   loading: boolean = true;

    constructor(private paymentService:  PaymentService,  private  dialog: MatDialog)  {}

   ngOnInit():  void  {
      this.loadPayments();
    }

    loadPayments(): void  {
       this.paymentService.getPayments().subscribe(data  => {
           this.payments =  data;
          this.totalAmount  =  data.reduce((sum,  p) =>  sum  +  p.amount, 0);
          this.loading = false;
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

   clear(table: any): void {
       table.clear();
   }
}
