import  {  Component,  Inject  } from  '@angular/core';
import  {  MAT_DIALOG_DATA, MatDialogRef,  MatDialogModule  }  from  '@angular/material/dialog';
import  {  Patient  }  from '../patient.service';
import  {  SeanceService  } from  '../../seances/seance.service';
import  {  PaymentService }  from  '../../payments/payment.service';
import  { CommonModule  }  from  '@angular/common';

import  {  TableModule  }  from 'primeng/table';
import  {  FormsModule  } from  '@angular/forms';

@Component({
   selector:  'app-patient-detail-dialog',
   templateUrl:  './patient-detail-dialog.component.html',
    styleUrls: ['./patient-detail-dialog.component.scss'],
    standalone:  true,
   imports:  [
       CommonModule,
       FormsModule,
       MatDialogModule,
       TableModule
   ]
})
export  class PatientDetailDialogComponent  {
    seances: any[]  =  [];
   payments:  any[]  =  [];

   loadingSeances  =  true;
   loadingPayments  =  true;

    constructor(
       @Inject(MAT_DIALOG_DATA)  public data:  {  patient:  Patient  },
       private seanceService:  SeanceService,
       private  paymentService:  PaymentService,
       private  dialogRef: MatDialogRef<PatientDetailDialogComponent>
    )  {
       this.loadSeances();
       this.loadPayments();
   }

   loadSeances()  {
       this.seanceService.getSeancesByPatientId(this.data.patient.id!).subscribe({
           next: seances  =>  {
              this.seances  =  seances;
              this.loadingSeances  =  false;
          },
           error:  err =>  {
              console.error('Error  fetching  seances:',  err);
              this.loadingSeances  =  false;
          }
       });
    }

    loadPayments()  {
       this.paymentService.getPaymentsByPatientId(this.data.patient.id!).subscribe({
          next:  payments  =>  {
              this.payments  = payments;
               this.loadingPayments =  false;
           },
          error:  err  =>  {
              console.error('Error  fetching  payments:', err);
               this.loadingPayments =  false;
           }
       });
   }

   close()  {
       this.dialogRef.close();
    }
}
