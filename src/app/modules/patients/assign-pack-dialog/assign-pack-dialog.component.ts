import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Patient } from '../patient.service';
import { Pack, PackService } from '../../pack-management/pack.service';
import { PatientPackService } from '../../pack-management/patient-pack.service';
import { AppCurrencyPipe } from '../../../core/pipes/app-currency.pipe';

@Component({
  selector: 'app-assign-pack-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, TranslateModule, AppCurrencyPipe],
  templateUrl: './assign-pack-dialog.component.html',
  styleUrls: ['./assign-pack-dialog.component.scss']
})
export class AssignPackDialogComponent implements OnInit {
  form: FormGroup;
  packs: Pack[] = [];
  selectedPack: Pack | null = null;
  agreedPrice = 0;
  saving = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private packService: PackService,
    private patientPackService: PatientPackService,
    private dialogRef: MatDialogRef<AssignPackDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { patient: Patient }
  ) {
    const today = new Date().toISOString().substring(0, 10);
    this.form = this.fb.group({
      packId: ['', Validators.required],
      priceType: ['CABINET', Validators.required],
      purchaseDate: [today, Validators.required]
    });
  }

  ngOnInit(): void {
    this.packService.getPacks().subscribe((packs) => {
      this.packs = packs ?? [];
    });

    this.form.get('packId')?.valueChanges.subscribe(() => this.updatePreview());
    this.form.get('priceType')?.valueChanges.subscribe(() => this.updatePreview());
  }

  updatePreview(): void {
    const packId = Number(this.form.get('packId')?.value);
    const priceType = this.form.get('priceType')?.value;
    this.selectedPack = this.packs.find((p) => p.id === packId) ?? null;
    if (!this.selectedPack) {
      this.agreedPrice = 0;
      return;
    }
    this.agreedPrice = priceType === 'MAISON' ? this.selectedPack.prixMaison : this.selectedPack.prixCabinet;
  }

  save(): void {
    if (this.form.invalid || !this.data.patient.id || this.saving) {
      return;
    }
    this.saving = true;
    this.errorMessage = '';
    const { packId, priceType, purchaseDate } = this.form.value;
    this.patientPackService
      .assignPack({
        patientId: this.data.patient.id,
        packId: Number(packId),
        priceType,
        purchaseDate
      })
      .subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => {
          this.saving = false;
          const msg = err.error?.message;
          this.errorMessage = msg && !msg.startsWith('pages.') ? msg : 'pages.patientPack.assignError';
        }
      });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
