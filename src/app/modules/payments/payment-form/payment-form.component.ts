import {  Component,  Inject  } from  '@angular/core';
import  { FormBuilder,  FormGroup,  Validators  } from  '@angular/forms';
import  { MatDialogRef,  MAT_DIALOG_DATA, MatDialogModule  }  from '@angular/material/dialog';
import  {  PaymentService, Payment  }  from  '../payment.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
   selector:  'app-payment-form',
   templateUrl:  './payment-form.component.html',
   styleUrls: ['./payment-form.component.scss'],
   standalone: true,
   imports: [CommonModule, ReactiveFormsModule, MatDialogModule]
})
export class  PaymentFormComponent  {
   form:  FormGroup;

   methods  = ['CASH',  'CARD'];
   statuses  =  ['PAID',  'PENDING'];

    constructor(
      private  fb:  FormBuilder,
       private paymentService:  PaymentService,
       private  dialogRef: MatDialogRef<PaymentFormComponent>,
       @Inject(MAT_DIALOG_DATA)  public  data: Payment
    ) {
       this.form  =  this.fb.group({
          patientId:  [data?.patientId ||  '',  Validators.required],
          seanceId:  [data?.seanceId  || ''],
           amount: [data?.amount  ||  '',  Validators.required],
          date:  [this.toDateInput(data?.date),  Validators.required],
          method:  [data?.method  || '',  Validators.required],
          status:  [data?.status  ||  '', Validators.required]
       });
   }

   private toDateInput(value?: string): string {
     if (!value) return '';
     return value.substring(0, 10);
   }

   save():  void  {
       if (this.form.valid)  {
          const  payment  =  this.form.value;
          if  (this.data?.id) {
              this.paymentService.updatePayment(this.data.id,  payment).subscribe(()  => this.dialogRef.close(true));
           } else  {
              this.paymentService.addPayment(payment).subscribe(()  => this.dialogRef.close(true));
           }
      }
    }

    cancel(): void  {
       this.dialogRef.close(false);
   }
}
