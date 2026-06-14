import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { SeanceService, Seance } from '../seance.service';
import { PatientService, Patient } from '../../patients/patient.service';
import { UserService, User } from '../../users/user.service';
import { PatientPack, PatientPackService } from '../../pack-management/patient-pack.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

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
  therapists: User[] = [];
  activePack: PatientPack | null = null;
  private patientSub?: Subscription;

  constructor(
    private fb: FormBuilder,
    private seanceService: SeanceService,
    private patientService: PatientService,
    private userService: UserService,
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
    this.userService.getUsers().subscribe((users) => {
      this.therapists = users.filter((user) => user.enabled);
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
    if (this.form.valid) {
      const seance = this.form.value;
      if (!this.data?.id) {
        seance.status = seance.status || 'SCHEDULED';
      }
      if (this.data?.id) {
        this.seanceService.updateSeance(this.data.id, seance).subscribe(() => this.dialogRef.close(true));
      } else {
        this.seanceService.addSeance(seance).subscribe(() => this.dialogRef.close(true));
      }
    }
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
