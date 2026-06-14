import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Patient } from '../patient.service';
import { SeanceService } from '../../seances/seance.service';
import { PaymentService } from '../../payments/payment.service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TranslateModule } from '@ngx-translate/core';
import { AppCurrencyPipe } from '../../../core/pipes/app-currency.pipe';

type DetailTab = 'info' | 'seances' | 'payments';

@Component({
  selector: 'app-patient-detail-dialog',
  templateUrl: './patient-detail-dialog.component.html',
  styleUrls: ['./patient-detail-dialog.component.scss'],
  standalone: true,
  imports: [CommonModule, MatDialogModule, TableModule, TranslateModule, AppCurrencyPipe]
})
export class PatientDetailDialogComponent {
  activeTab: DetailTab = 'info';
  seances: any[] = [];
  payments: any[] = [];
  loadingSeances = false;
  loadingPayments = false;
  private seancesLoaded = false;
  private paymentsLoaded = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { patient: Patient },
    private seanceService: SeanceService,
    private paymentService: PaymentService,
    private dialogRef: MatDialogRef<PatientDetailDialogComponent>
  ) {}

  setTab(tab: DetailTab): void {
    this.activeTab = tab;
    const patientId = this.data.patient.id;
    if (!patientId) {
      return;
    }

    if (tab === 'seances' && !this.seancesLoaded) {
      this.loadSeances(patientId);
    }
    if (tab === 'payments' && !this.paymentsLoaded) {
      this.loadPayments(patientId);
    }
  }

  private loadSeances(patientId: number): void {
    this.loadingSeances = true;
    this.seanceService.getSeancesByPatientId(patientId).subscribe({
      next: (seances) => {
        this.seances = seances ?? [];
        this.seancesLoaded = true;
        this.loadingSeances = false;
      },
      error: (err) => {
        console.error('Error fetching seances:', err);
        this.loadingSeances = false;
      }
    });
  }

  private loadPayments(patientId: number): void {
    this.loadingPayments = true;
    this.paymentService.getPaymentsByPatientId(patientId).subscribe({
      next: (payments) => {
        this.payments = payments ?? [];
        this.paymentsLoaded = true;
        this.loadingPayments = false;
      },
      error: (err) => {
        console.error('Error fetching payments:', err);
        this.loadingPayments = false;
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
