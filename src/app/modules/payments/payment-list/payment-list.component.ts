import  { Component  }  from '@angular/core';
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
import { TranslateModule } from '@ngx-translate/core';
import { AppCurrencyPipe } from '../../../core/pipes/app-currency.pipe';
import { FORM_DIALOG_OPTIONS } from '../../../core/constants/dialog.config';
import { runAfterBrowserHydration } from '../../../core/utils/browser-init';
import { PatientService, Patient } from '../../patients/patient.service';

@Component({
   selector:  'app-payment-list',
   templateUrl:  './payment-list.component.html',
   styleUrls:  ['./payment-list.component.scss'],
   standalone: true,
   imports: [CommonModule, TableModule, ButtonModule, InputTextModule, IconFieldModule, InputIconModule, TagModule, CardComponent, TranslateModule, AppCurrencyPipe]
})
export class  PaymentListComponent {
   payments:  Payment[] =  [];
   patients: Patient[] = [];
   totalAmount:  number  =  0;
   loading: boolean = true;

    constructor(
      private paymentService: PaymentService,
      private patientService: PatientService,
      private dialog: MatDialog
    ) {
      runAfterBrowserHydration(() => {
        this.patientService.getPatients().subscribe((patients) => {
          this.patients = patients;
          this.loadPayments();
        });
      });
    }

    getPatientName(patientId: number): string {
      const patient = this.patients.find((p) => p.id === patientId);
      return patient ? `${patient.firstName} ${patient.lastName}` : `Patient ${patientId}`;
    }

    loadPayments(): void  {
       this.paymentService.getPayments().subscribe(data  => {
           this.payments = data.map((p) => ({
             ...p,
             patientName: this.getPatientName(p.patientId)
           }));
          this.totalAmount  =  data.reduce((sum,  p) =>  sum  +  p.amount, 0);
          this.loading = false;
       });
   }

   addPayment():  void  {
       const dialogRef  =  this.dialog.open(PaymentFormComponent, FORM_DIALOG_OPTIONS);
       dialogRef.afterClosed().subscribe(result =>  {
          if  (result)  this.loadPayments();
       });
   }

   editPayment(payment:  Payment): void  {
       const  dialogRef =  this.dialog.open(PaymentFormComponent,  { ...FORM_DIALOG_OPTIONS, data:  payment  });
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
