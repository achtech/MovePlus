import { Component, Inject, OnDestroy, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { PaymentService, Payment } from '../payment.service';

import { PatientService, Patient } from '../../patients/patient.service';

import { SeanceService, Seance } from '../../seances/seance.service';

import { PatientPack, PatientPackService } from '../../pack-management/patient-pack.service';

import { ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';

import { Subscription } from 'rxjs';

import {
  getFormValidationMessage,
  getApiErrorMessage,
  isFieldInvalid,
  getFieldErrorMessage,
  FORM_SAVE_ERROR
} from '../../../core/utils/form-submit.utils';



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

  patientPacks: PatientPack[] = [];

  selectedPack: PatientPack | null = null;



  methods = ['CASH', 'CARD'];

  statuses = ['PAID', 'PENDING'];

  submitError = '';

  fieldInvalid = (name: string) => isFieldInvalid(this.form, name);
  fieldError = (name: string, label: string) => getFieldErrorMessage(this.form, name, label);



  private patientSub?: Subscription;

  private packSub?: Subscription;

  private seanceSub?: Subscription;



  constructor(

    private fb: FormBuilder,

    private paymentService: PaymentService,

    private patientService: PatientService,

    private seanceService: SeanceService,

    private patientPackService: PatientPackService,

    private dialogRef: MatDialogRef<PaymentFormComponent>,

    @Inject(MAT_DIALOG_DATA) public data: Payment

  ) {

    this.loadPatients();

    const isNew = !data?.id;

    this.form = this.fb.group({

      patientId: [data?.patientId || '', Validators.required],

      patientPackId: [data?.patientPackId || ''],

      seanceId: [data?.seanceId || ''],

      amount: [data?.amount ?? '', Validators.required],

      dateTime: [this.toDateTimeLocal(data), Validators.required],

      method: [data?.method || (isNew ? 'CASH' : ''), Validators.required],

      status: [data?.status || (isNew ? 'PAID' : ''), Validators.required]

    });

  }



  ngOnInit(): void {

    this.patientSub = this.form.get('patientId')?.valueChanges.subscribe((patientId) => {

      this.form.patchValue({ seanceId: '', patientPackId: '' }, { emitEvent: false });

      this.selectedPack = null;

      this.form.get('seanceId')?.enable({ emitEvent: false });

      this.loadSeances(patientId);

      this.loadPatientPacks(patientId);

    });



    this.packSub = this.form.get('patientPackId')?.valueChanges.subscribe((packId) => {

      this.onPackSelected(packId);

    });



    this.seanceSub = this.form.get('seanceId')?.valueChanges.subscribe((seanceId) => {

      if (seanceId) {

        this.form.patchValue({ patientPackId: '' }, { emitEvent: false });

        this.selectedPack = null;

        this.form.get('seanceId')?.enable({ emitEvent: false });

      }

    });



    const patientId = this.form.get('patientId')?.value;

    if (patientId) {

      this.loadSeances(patientId, this.form.get('seanceId')?.value);

      this.loadPatientPacks(patientId, this.form.get('patientPackId')?.value);

    }

  }



  ngOnDestroy(): void {

    this.patientSub?.unsubscribe();

    this.packSub?.unsubscribe();

    this.seanceSub?.unsubscribe();

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



  loadPatientPacks(patientId: number | string, selectedPackId?: number | string): void {

    if (!patientId) {

      this.patientPacks = [];

      this.selectedPack = null;

      return;

    }

    this.patientPackService.getPacksForPatient(Number(patientId)).subscribe((packs) => {

      this.patientPacks = packs.filter(

        (pack) => pack.subscriptionStatus === 'ACTIVE' && (pack.amountRemaining ?? 0) > 0

      );

      if (selectedPackId) {

        this.form.patchValue({ patientPackId: selectedPackId }, { emitEvent: false });

        this.onPackSelected(selectedPackId, false);

      }

    });

  }



  formatSeanceLabel(seance: Seance): string {

    const dateTime = seance.dateTime?.substring(0, 16).replace('T', ' ') || '';

    return `${dateTime} — ${seance.type} (${seance.status})`;

  }



  formatPackLabel(pack: PatientPack): string {

    const remaining = pack.amountRemaining ?? 0;

    return `${pack.packName} — reste ${remaining.toFixed(2)} Dh`;

  }



  private onPackSelected(packId: number | string, updateAmount = true): void {

    const seanceControl = this.form.get('seanceId');

    if (!packId) {

      this.selectedPack = null;

      seanceControl?.enable({ emitEvent: false });

      return;

    }



    const pack = this.patientPacks.find((p) => p.id === Number(packId)) ?? null;

    this.selectedPack = pack;

    seanceControl?.disable({ emitEvent: false });



    if (pack && updateAmount && !this.data?.id) {

      this.form.patchValue(

        {

          amount: pack.amountRemaining ?? '',

          seanceId: ''

        },

        { emitEvent: false }

      );

    }

  }



  private toDateTimeLocal(data?: Payment): string {

    if (data?.createdAt) {

      return data.createdAt.length >= 16 ? data.createdAt.substring(0, 16) : data.createdAt;

    }

    if (data?.date) {

      const timePart = data.date.length > 10 ? data.date.substring(11, 16) : '12:00';

      return `${data.date.substring(0, 10)}T${timePart}`;

    }

    return this.nowDateTimeLocal();

  }



  private nowDateTimeLocal(): string {

    const d = new Date();

    const pad = (n: number) => String(n).padStart(2, '0');

    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;

  }



  save(): void {

    this.submitError = '';

    const validationError = getFormValidationMessage(this.form, {

      patientId: 'patient',

      amount: 'montant',

      dateTime: 'date et heure',

      method: 'méthode',

      status: 'statut'

    });

    if (validationError) {

      this.submitError = validationError;

      return;

    }



    const { dateTime, patientPackId, seanceId, ...rest } = this.form.getRawValue();

    const payment: Payment = {

      ...rest,

      date: dateTime.substring(0, 10),

      createdAt: `${dateTime}:00`,

      seanceId: seanceId || undefined,

      patientPackId: patientPackId || undefined,

      paymentType: patientPackId ? 'PACK' : 'SEANCE',

      label: this.selectedPack?.packName || (patientPackId ? 'Pack' : 'Séance Unique')

    };



    const request$ = this.data?.id

      ? this.paymentService.updatePayment(this.data.id, payment)

      : this.paymentService.addPayment(payment);



    request$.subscribe({

      next: () => this.dialogRef.close(true),

      error: (err) => {
        this.submitError = getApiErrorMessage(err, FORM_SAVE_ERROR);
      }

    });

  }



  cancel(): void {

    this.dialogRef.close(false);

  }

}


