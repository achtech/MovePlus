import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-password-reset-dialog',
  templateUrl: './password-reset-dialog.component.html',
  styleUrls: ['./password-reset-dialog.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule]
})
export class PasswordResetDialogComponent {
  passwordForm: FormGroup;

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
    if (this.passwordForm.valid) {
      // Check if passwords match
      const { password, confirmPassword } = this.passwordForm.value;
      if (password === confirmPassword) {
        // Close the dialog and pass the new password
        this.dialogRef.close(password);
      } else {
        // Handle password mismatch
        alert('Passwords do not match');
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
