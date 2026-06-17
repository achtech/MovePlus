import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import {
  getFormValidationMessage,
  isFieldInvalid,
  getFieldErrorMessage
} from '../../../core/utils/form-submit.utils';

@Component({
  selector: 'app-password-reset-dialog',
  templateUrl: './password-reset-dialog.component.html',
  styleUrls: ['./password-reset-dialog.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule]
})
export class PasswordResetDialogComponent {
  passwordForm: FormGroup;
  submitError = '';

  fieldInvalid = (name: string) => isFieldInvalid(this.passwordForm, name);
  fieldError = (name: string, label: string) => getFieldErrorMessage(this.passwordForm, name, label);

  constructor(
    public dialogRef: MatDialogRef<PasswordResetDialogComponent>,
    private fb: FormBuilder
  ) {
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    this.submitError = '';
    const validationError = getFormValidationMessage(this.passwordForm, {
      password: 'mot de passe',
      confirmPassword: 'confirmation du mot de passe'
    });
    if (validationError) {
      this.submitError = validationError;
      return;
    }

    const { password, confirmPassword } = this.passwordForm.value;
    if (password !== confirmPassword) {
      this.submitError = 'Les mots de passe ne correspondent pas.';
      return;
    }

    this.dialogRef.close(password);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
