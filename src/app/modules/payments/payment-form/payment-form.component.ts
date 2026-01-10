import {  Component,  Inject  } from  '@angular/core';
import  { FormBuilder,  FormGroup,  Validators  } from  '@angular/forms';
import  { MatDialogRef,  MAT_DIALOG_DATA, MatDialogModule  }  from '@angular/material/dialog';
import  {  PaymentService, Payment  }  from  '../payment.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';

@Component({
   selector:  'app-payment-form',
   templateUrl:  './payment-form.component.html',
   styleUrls: ['./payment-form.component.scss'],
   standalone: true,
   imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatDialogModule]
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
          date:  [data?.date ||  '',  Validators.required],
          method:  [data?.method  || '',  Validators.required],
          status:  [data?.status  ||  '', Validators.required]
       });
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
