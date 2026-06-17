import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { PatientService, Patient } from '../patient.service';
import { CommonModule } from '@angular/common';
import {
  getFormValidationMessage,
  getApiErrorMessage,
  isFieldInvalid,
  getFieldErrorMessage,
  FORM_SAVE_ERROR
} from '../../../core/utils/form-submit.utils';

function optionalEmail(control: AbstractControl) {
  const value = (control.value ?? '').trim();
  if (!value) {
    return null;
  }
  return Validators.email(control);
}

function notFutureBirthDate(control: AbstractControl) {
  const value = (control.value ?? '').trim();
  if (!value) {
    return null;
  }
  const date = new Date(`${value}T23:59:59`);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return date > today ? { futureDate: true } : null;
}

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule]
})
export class PatientFormComponent {
  form: FormGroup;
  submitError = '';

  fieldInvalid = (name: string) => isFieldInvalid(this.form, name);
  fieldError = (name: string, label: string) => getFieldErrorMessage(this.form, name, label);

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private dialogRef: MatDialogRef<PatientFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Patient
  ) {
    this.form = this.fb.group({
      firstName: [data?.firstName || '', Validators.required],
      lastName: [data?.lastName || '', Validators.required],
      birthDate: [data?.birthDate || '', notFutureBirthDate],
      phone: [data?.phone || '', Validators.required],
      email: [data?.email || '', optionalEmail],
      address: [data?.address || ''],
      medicalNotes: [data?.medicalNotes || '']
    });
  }

  save(): void {
    this.submitError = '';
    const validationError = getFormValidationMessage(this.form, {
      firstName: 'prénom',
      lastName: 'nom',
      phone: 'téléphone',
      email: 'email',
      birthDate: 'date de naissance'
    });
    if (validationError) {
      this.submitError = validationError;
      return;
    }

    const patient = this.buildPayload();
    const request$ = this.data?.id
      ? this.patientService.updatePatient(this.data.id, patient)
      : this.patientService.addPatient(patient);

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

  private buildPayload(): Patient {
    const value = this.form.getRawValue();
    return {
      id: this.data?.id,
      firstName: (value.firstName ?? '').trim(),
      lastName: (value.lastName ?? '').trim(),
      birthDate: value.birthDate || '',
      phone: (value.phone ?? '').trim(),
      email: (value.email ?? '').trim(),
      address: (value.address ?? '').trim(),
      medicalNotes: (value.medicalNotes ?? '').trim()
    };
  }
}
