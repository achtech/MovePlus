import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Patient } from '../patient.service';
import { SeanceService } from '../../seances/seance.service';
import { PaymentService } from '../../payments/payment.service';
import { PatientPack, PatientPackService } from '../../pack-management/patient-pack.service';
import { PackDepositDialogComponent } from '../../pack-management/pack-deposit-dialog/pack-deposit-dialog.component';
import { AssignPackDialogComponent } from '../assign-pack-dialog/assign-pack-dialog.component';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppCurrencyPipe } from '../../../core/pipes/app-currency.pipe';
import { FORM_DIALOG_OPTIONS } from '../../../core/constants/dialog.config';

type DetailTab = 'info' | 'seances' | 'payments';

@Component({
  selector: 'app-patient-detail-dialog',
  templateUrl: './patient-detail-dialog.component.html',
  styleUrls: ['./patient-detail-dialog.component.scss'],
  standalone: true,
  imports: [CommonModule, MatDialogModule, TableModule, TranslateModule, AppCurrencyPipe]
})
export class PatientDetailDialogComponent implements OnInit {
  activeTab: DetailTab = 'info';
  seances: any[] = [];
  payments: any[] = [];
  activePack: PatientPack | null = null;
  packHistory: PatientPack[] = [];
  loadingPackHistory = false;
  loadingSeances = false;
  loadingPayments = false;
  private seancesLoaded = false;
  private paymentsLoaded = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { patient: Patient },
    private seanceService: SeanceService,
    private paymentService: PaymentService,
    private patientPackService: PatientPackService,
    private dialog: MatDialog,
    private translate: TranslateService,
    private dialogRef: MatDialogRef<PatientDetailDialogComponent>
  ) {}

  ngOnInit(): void {
    if (this.data.patient.id) {
      this.loadActivePack(this.data.patient.id);
      this.loadPackHistory(this.data.patient.id);
    }
  }

  setTab(tab: DetailTab): void {
    this.activeTab = tab;
    const patientId = this.data.patient.id;
    if (!patientId) {
      return;
    }

    if (tab === 'seances' && !this.seancesLoaded) {
      this.loadSeances(patientId);
      this.loadActivePack(patientId);
    }
    if (tab === 'payments' && !this.paymentsLoaded) {
      this.loadPayments(patientId);
      this.loadActivePack(patientId);
    }
  }

  private loadActivePack(patientId: number): void {
    this.patientPackService.getActivePackForPatient(patientId).subscribe((pack) => {
      this.activePack = pack;
    });
  }

  private loadPackHistory(patientId: number): void {
    this.loadingPackHistory = true;
    this.patientPackService.getPacksForPatient(patientId).subscribe({
      next: (packs) => {
        this.packHistory = (packs ?? []).filter((p) => p.subscriptionStatus !== 'ACTIVE');
        this.loadingPackHistory = false;
      },
      error: () => {
        this.loadingPackHistory = false;
      }
    });
  }

  subscriptionStatusKey(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return 'pages.patientPack.statusCompleted';
      case 'CANCELLED':
        return 'pages.patientPack.statusCancelled';
      default:
        return 'pages.patientPack.statusActive';
    }
  }

  sessionsUsed(pack: PatientPack): number {
    return pack.totalSessions - pack.remainingSessions;
  }

  private loadSeances(patientId: number): void {
    this.loadingSeances = true;
    this.seanceService.getSeancesByPatientId(patientId).subscribe({
      next: (seances) => {
        this.seances = seances ?? [];
        this.seancesLoaded = true;
        this.loadingSeances = false;
      },
      error: () => {
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
      error: () => {
        this.loadingPayments = false;
      }
    });
  }

  assignPack(): void {
    if (!this.data.patient.id || this.activePack) {
      return;
    }
    this.openAssignDialog();
  }

  cancelPack(): void {
    if (!this.activePack?.id) {
      return;
    }
    const message = this.translate.instant('pages.patientPack.confirmCancelPack');
    if (!confirm(message)) {
      return;
    }
    this.patientPackService.cancelSubscription(this.activePack.id).subscribe({
      next: () => this.refreshAfterPackChange()
    });
  }

  changePack(): void {
    if (!this.activePack?.id || !this.data.patient.id) {
      return;
    }
    const message = this.translate.instant('pages.patientPack.confirmChangePack');
    if (!confirm(message)) {
      return;
    }
    const packId = this.activePack.id;
    this.patientPackService.cancelSubscription(packId).subscribe({
      next: () => {
        this.activePack = null;
        this.openAssignDialog();
      }
    });
  }

  private openAssignDialog(): void {
    if (!this.data.patient.id) {
      return;
    }
    const ref = this.dialog.open(AssignPackDialogComponent, {
      ...FORM_DIALOG_OPTIONS,
      data: { patient: this.data.patient }
    });
    ref.afterClosed().subscribe((saved) => {
      if (saved) {
        this.refreshAfterPackChange();
      }
    });
  }

  private refreshAfterPackChange(): void {
    if (!this.data.patient.id) {
      return;
    }
    this.loadActivePack(this.data.patient.id);
    this.loadPackHistory(this.data.patient.id);
    this.seancesLoaded = false;
    this.paymentsLoaded = false;
  }

  collectDeposit(): void {
    if (!this.activePack) {
      return;
    }
    const ref = this.dialog.open(PackDepositDialogComponent, {
      ...FORM_DIALOG_OPTIONS,
      data: this.activePack
    });
    ref.afterClosed().subscribe((saved) => {
      if (saved && this.data.patient.id) {
        this.loadActivePack(this.data.patient.id);
        this.paymentsLoaded = false;
        this.loadPayments(this.data.patient.id);
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
