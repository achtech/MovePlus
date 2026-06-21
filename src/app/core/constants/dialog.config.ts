import { MatDialogConfig } from '@angular/material/dialog';

export const FORM_DIALOG_OPTIONS: MatDialogConfig = {
  width: '720px',
  maxWidth: '96vw',
  panelClass: ['datta-dialog'],
  autoFocus: false
};

export const PATIENT_DETAIL_DIALOG_OPTIONS: MatDialogConfig = {
  width: '720px',
  maxWidth: '96vw',
  panelClass: ['middle-dialog', 'datta-dialog'],
  autoFocus: false
};

export const PATIENT_CALENDAR_DIALOG_OPTIONS: MatDialogConfig = {
  width: '640px',
  maxWidth: '96vw',
  panelClass: ['datta-dialog'],
  autoFocus: false
};

export const COMPTE_RENDU_DIALOG_OPTIONS: MatDialogConfig = {
  width: '900px',
  maxWidth: '96vw',
  panelClass: ['datta-dialog', 'compte-rendu-dialog'],
  autoFocus: false
};
