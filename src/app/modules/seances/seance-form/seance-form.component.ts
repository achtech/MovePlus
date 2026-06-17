import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { SeanceService, Seance } from '../seance.service';
import { PatientService, Patient } from '../../patients/patient.service';
import { TeamMember, TeamMemberService } from '../../team/team-member.service';
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
  selector: 'app-seance-form',
  templateUrl: './seance-form.component.html',
  styleUrls: ['./seance-form.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule]
})
export class SeanceFormComponent implements OnInit, OnDestroy {
  form: FormGroup;
  patients: Patient[] = [];
  therapists: TeamMember[] = [];
  activePack: PatientPack | null = null;
  submitError = '';

  fieldInvalid = (name: string) => isFieldInvalid(this.form, name);
  fieldError = (name: string, label: string) => getFieldErrorMessage(this.form, name, label);
  private patientSub?: Subscription;

  constructor(
    private fb: FormBuilder,
    private seanceService: SeanceService,
    private patientService: PatientService,
    private teamMemberService: TeamMemberService,
    private patientPackService: PatientPackService,
    private dialogRef: MatDialogRef<SeanceFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Seance
  ) {
    this.loadPatients();
    this.loadTherapists();
    this.form = this.fb.group({
      patientId: [data?.patientId || '', Validators.required],
      therapistId: [data?.therapistId || '', Validators.required],
      dateTime: [this.toDateTimeLocal(data?.dateTime), Validators.required],
      duration: [data?.duration || 60, Validators.required],
      type: [data?.type || '', Validators.required],
      status: [data?.status || 'SCHEDULED', Validators.required],
      notes: [data?.notes || '']
    });
  }

  ngOnInit(): void {
    this.patientSub = this.form.get('patientId')?.valueChanges.subscribe((patientId) => {
      this.loadActivePack(patientId);
    });
    if (this.form.get('patientId')?.value) {
      this.loadActivePack(this.form.get('patientId')?.value);
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

  loadTherapists(): void {
    this.teamMemberService.getActiveTeamMembers().subscribe((members) => {
      this.therapists = members;
    });
  }

  private loadActivePack(patientId: number | string): void {
    if (!patientId) {
      this.activePack = null;
      return;
    }
    this.patientPackService.getActivePackForPatient(Number(patientId)).subscribe((pack) => {
      this.activePack = pack;
    });
  }

  private toDateTimeLocal(value?: string): string {
    if (!value) return '';
    return value.length >= 16 ? value.substring(0, 16) : value;
  }

  save(): void {
    this.submitError = '';
    const validationError = getFormValidationMessage(this.form, {
      patientId: 'patient',
      therapistId: 'thérapeute',
      dateTime: 'date et heure',
      duration: 'durée',
      type: 'type de séance',
      status: 'statut'
    });
    if (validationError) {
      this.submitError = validationError;
      return;
    }

    const seance = this.form.value;
    if (!this.data?.id) {
      seance.status = seance.status || 'SCHEDULED';
    }
    const request$ = this.data?.id
      ? this.seanceService.updateSeance(this.data.id, seance)
      : this.seanceService.addSeance(seance);

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
