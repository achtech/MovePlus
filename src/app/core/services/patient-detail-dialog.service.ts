import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PatientService, Patient } from '../../modules/patients/patient.service';
import { PatientDetailDialogComponent } from '../../modules/patients/patient-detail-dialog/patient-detail-dialog.component';
import { PATIENT_DETAIL_DIALOG_OPTIONS } from '../constants/dialog.config';

@Injectable({ providedIn: 'root' })
export class PatientDetailDialogService {
  private dialog = inject(MatDialog);
  private patientService = inject(PatientService);

  open(patient: Patient): void {
    this.dialog.open(PatientDetailDialogComponent, {
      ...PATIENT_DETAIL_DIALOG_OPTIONS,
      data: { patient }
    });
  }

  openByPatientId(patientId: number): void {
    this.patientService.getPatientById(patientId).subscribe((patient) => {
      if (patient) {
        this.open(patient);
      }
    });
  }
}
