import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PatientPack, PatientPackService } from '../patient-pack.service';

@Component({
  selector: 'app-pack-deposit-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, TranslateModule],
  template: `
    <h2 mat-dialog-title>{{ 'pages.patientPack.collectDeposit' | translate }}</h2>
    <mat-dialog-content>
      <p class="pack-summary">{{ data.packName }} — {{ 'pages.patientPack.remainingToPay' | translate }}: {{ data.amountRemaining | number: '1.2-2' }} Dh</p>
      <form [formGroup]="form" class="datta-form-grid">
        <div class="form-group">
          <label for="amount">{{ 'pages.payments.amount' | translate }}</label>
          <input id="amount" type="number" class="form-control" formControlName="amount" min="0.01" step="0.01" />
        </div>
        <div class="form-group">
          <label for="method">{{ 'pages.payments.method' | translate }}</label>
          <select id="method" class="form-control" formControlName="method">
            <option value="CASH">CASH</option>
            <option value="CARD">CARD</option>
            <option value="TRANSFER">TRANSFER</option>
          </select>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end" class="datta-dialog-actions">
      <button type="button" class="btn btn-secondary" (click)="cancel()">{{ 'common.cancel' | translate }}</button>
      <button type="button" class="btn btn-primary" [disabled]="form.invalid" (click)="save()">{{ 'common.save' | translate }}</button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .pack-summary {
        margin-bottom: 1rem;
        color: #475569;
      }
    `
  ]
})
export class PackDepositDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private patientPackService: PatientPackService,
    private dialogRef: MatDialogRef<PackDepositDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PatientPack
  ) {
    const defaultAmount = Math.min(data.amountRemaining ?? 0, data.amountRemaining ?? 0);
    this.form = this.fb.group({
      amount: [defaultAmount > 0 ? defaultAmount : '', [Validators.required, Validators.min(0.01)]],
      method: ['CASH', Validators.required]
    });
  }

  save(): void {
    if (this.form.invalid || !this.data.id) {
      return;
    }
    this.patientPackService
      .recordDeposit(this.data.id, {
        amount: this.form.value.amount,
        method: this.form.value.method,
        status: 'PAID'
      })
      .subscribe(() => this.dialogRef.close(true));
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
