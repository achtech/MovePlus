import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { PaymentService, Payment } from '../payment.service';
import { PatientService, Patient } from '../../patients/patient.service';
import { SeanceService, Seance } from '../../seances/seance.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule]
})
export class PaymentFormComponent implements OnInit, OnDestroy {
  form: FormGroup;
  patients: Patient[] = [];
  seances: Seance[] = [];

  methods = ['CASH', 'CARD'];
  statuses = ['PAID', 'PENDING'];

  private patientSub?: Subscription;

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private patientService: PatientService,
    private seanceService: SeanceService,
    private dialogRef: MatDialogRef<PaymentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Payment
  ) {
    this.loadPatients();
    this.form = this.fb.group({
      patientId: [data?.patientId || '', Validators.required],
      seanceId: [data?.seanceId || ''],
      amount: [data?.amount || '', Validators.required],
      date: [this.toDateInput(data?.date), Validators.required],
      method: [data?.method || '', Validators.required],
      status: [data?.status || '', Validators.required]
    });
  }

  ngOnInit(): void {
    this.patientSub = this.form.get('patientId')?.valueChanges.subscribe((patientId) => {
      this.form.patchValue({ seanceId: '' }, { emitEvent: false });
      this.loadSeances(patientId);
    });
    if (this.form.get('patientId')?.value) {
      this.loadSeances(this.form.get('patientId')?.value, this.form.get('seanceId')?.value);
    }
  }

  ngOnDestroy(): void {
    this.patientSub?.unsubscribe();
  }

  loadPatients(): void {
    this.patientService.getPatients().subscribe((patients) => {
      this.patients = patients;
    });
  }

  loadSeances(patientId: number | string, selectedSeanceId?: number | string): void {
    if (!patientId) {
      this.seances = [];
      return;
    }
    this.seanceService.getSeancesByPatientId(Number(patientId)).subscribe((seances) => {
      this.seances = seances.sort((a, b) => b.dateTime.localeCompare(a.dateTime));
      if (selectedSeanceId) {
        this.form.patchValue({ seanceId: selectedSeanceId }, { emitEvent: false });
      }
    });
  }

  formatSeanceLabel(seance: Seance): string {
    const dateTime = seance.dateTime?.substring(0, 16).replace('T', ' ') || '';
    return `${dateTime} — ${seance.type} (${seance.status})`;
  }

  private toDateInput(value?: string): string {
    if (!value) return '';
    return value.substring(0, 10);
  }

  save(): void {
    if (this.form.valid) {
      const payment = this.form.value;
      if (this.data?.id) {
        this.paymentService.updatePayment(this.data.id, payment).subscribe(() => this.dialogRef.close(true));
      } else {
        this.paymentService.addPayment(payment).subscribe(() => this.dialogRef.close(true));
      }
    }
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
