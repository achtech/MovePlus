import { Component, OnInit } from '@angular/core';
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
import { DeleteConfirmService } from '../../../core/services/delete-confirm.service';
import { DialogRefreshService } from '../../../core/services/dialog-refresh.service';
import { PatientService, Patient } from '../../patients/patient.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
   selector:  'app-payment-list',
   templateUrl:  './payment-list.component.html',
   styleUrls:  ['./payment-list.component.scss'],
   standalone: true,
   imports: [CommonModule, TableModule, ButtonModule, InputTextModule, IconFieldModule, InputIconModule, TagModule, CardComponent, TranslateModule, AppCurrencyPipe]
})
export class  PaymentListComponent implements OnInit {
   payments:  Payment[] =  [];
   patients: Patient[] = [];
   totalAmount:  number  =  0;
   loading: boolean = true;

    constructor(
      private paymentService: PaymentService,
      private patientService: PatientService,
      private dialog: MatDialog,
      private deleteConfirm: DeleteConfirmService,
      private dialogRefresh: DialogRefreshService
    ) {}

    ngOnInit(): void {
      this.loadPageData();
    }

    private loadPageData(): void {
      this.loading = true;
      forkJoin({
        patients: this.patientService.getPatients().pipe(catchError(() => of([] as Patient[]))),
        payments: this.paymentService.getPayments().pipe(catchError(() => of([] as Payment[])))
      }).subscribe(({ patients, payments }) => {
        this.patients = patients;
        this.payments = payments.map((p) => ({
          ...p,
          patientName: this.getPatientName(p.patientId)
        }));
        this.totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
        this.loading = false;
      });
    }

    getPatientName(patientId: number): string {
      const patient = this.patients.find((p) => p.id === patientId);
      return patient ? `${patient.firstName} ${patient.lastName}` : `Patient ${patientId}`;
    }

    loadPayments(): void  {
       this.loading = true;
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
       this.dialogRefresh.onSave(
         this.dialog.open(PaymentFormComponent, FORM_DIALOG_OPTIONS),
         () => this.loadPageData()
       );
   }

   editPayment(payment:  Payment): void  {
       this.dialogRefresh.onSave(
         this.dialog.open(PaymentFormComponent, { ...FORM_DIALOG_OPTIONS, data: payment }),
         () => this.loadPayments()
       );
    }

    deletePayment(id: number):  void  {
       this.deleteConfirm.confirmAndDelete(
         () => this.paymentService.deletePayment(id),
         () => this.loadPayments()
       );
   }

   clear(table: any): void {
       table.clear();
   }
}
