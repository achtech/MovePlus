import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { PackService, Pack } from '../pack.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  getFormValidationMessage,
  getApiErrorMessage,
  isFieldInvalid,
  getFieldErrorMessage,
  FORM_SAVE_ERROR
} from '../../../core/utils/form-submit.utils';

@Component({
  selector: 'app-pack-form-dialog',
  templateUrl: './pack-form-dialog.component.html',
  styleUrls: ['./pack-form-dialog.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule]
})
export class PackFormDialogComponent {
  form: FormGroup;
  submitError = '';

  fieldInvalid = (name: string) => isFieldInvalid(this.form, name);
  fieldError = (name: string, label: string) => getFieldErrorMessage(this.form, name, label);

  constructor(
    private fb: FormBuilder,
    private packService: PackService,
    private dialogRef: MatDialogRef<PackFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Pack
  ) {
    this.form = this.fb.group({
      nom: [data?.nom || '', Validators.required],
      nombreDeSeance: [data?.nombreDeSeance || '', [Validators.required, Validators.min(1)]],
      prixMaison: [data?.prixMaison || '', [Validators.required, Validators.min(0)]],
      prixCabinet: [data?.prixCabinet || '', Validators.min(0)]
    });
  }

  save(): void {
    this.submitError = '';
    const validationError = getFormValidationMessage(this.form, {
      nom: 'nom',
      nombreDeSeance: 'nombre de séances',
      prixMaison: 'prix maison',
      prixCabinet: 'prix cabinet'
    });
    if (validationError) {
      this.submitError = validationError;
      return;
    }

    const pack = this.form.value;
    const request$ = this.data?.id
      ? this.packService.updatePack(this.data.id, pack)
      : this.packService.addPack(pack);

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
