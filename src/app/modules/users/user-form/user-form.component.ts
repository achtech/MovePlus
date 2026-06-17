import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { UserService, User } from '../user.service';
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
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule]
})
export class UserFormComponent {
  form: FormGroup;
  submitError = '';

  fieldInvalid = (name: string) => isFieldInvalid(this.form, name);
  fieldError = (name: string, label: string) => getFieldErrorMessage(this.form, name, label);
  roles = ['ADMIN', 'ASSISTANT'];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) {
    this.form = this.isEdit ? this.buildEditForm(data) : this.buildCreateForm(data);
  }

  get isEdit(): boolean {
    return !!this.data?.id;
  }

  private buildCreateForm(data?: User): FormGroup {
    return this.fb.group(
      {
        username: [data?.username || '', Validators.required],
        email: [data?.email || '', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]],
        role: [data?.role || '', Validators.required],
        enabled: [data?.enabled ?? true, Validators.required]
      },
      { validators: UserFormComponent.passwordMatchValidator }
    );
  }

  private buildEditForm(data: User): FormGroup {
    return this.fb.group(
      {
        role: [data.role || '', Validators.required],
        enabled: [data.enabled ?? true, Validators.required],
        password: [''],
        confirmPassword: ['']
      },
      { validators: UserFormComponent.optionalPasswordMatchValidator }
    );
  }

  save(): void {
    this.submitError = '';

    if (this.isEdit) {
      this.saveEdit();
      return;
    }

    const validationError = getFormValidationMessage(this.form, {
      username: 'nom d\'utilisateur',
      email: 'email',
      password: 'mot de passe',
      confirmPassword: 'confirmation du mot de passe',
      role: 'rôle'
    });
    if (validationError) {
      this.submitError = validationError;
      return;
    }

    const formValue = { ...this.form.value };
    delete formValue.confirmPassword;

    this.userService.addUser(formValue).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => {
        this.submitError = getApiErrorMessage(err, FORM_SAVE_ERROR);
      }
    });
  }

  private saveEdit(): void {
    const validationError = getFormValidationMessage(this.form, {
      role: 'rôle'
    });
    if (validationError) {
      this.submitError = validationError;
      return;
    }

    const { role, enabled, password, confirmPassword } = this.form.value;
    if (password?.trim() && password !== confirmPassword) {
      this.submitError = 'Les mots de passe ne correspondent pas.';
      return;
    }

    this.userService
      .updateUserAdmin(this.data.id!, {
        role,
        enabled,
        password: password?.trim() || undefined
      })
      .subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => {
          this.submitError = getApiErrorMessage(err, FORM_SAVE_ERROR);
        }
      });
  }

  static passwordMatchValidator(form: FormGroup): ValidationErrors | null {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  static optionalPasswordMatchValidator(form: FormGroup): ValidationErrors | null {
    const password = form.get('password')?.value;
    const confirmPasswordControl = form.get('confirmPassword');
    if (!password?.trim()) {
      confirmPasswordControl?.setErrors(null);
      return null;
    }

    if (confirmPasswordControl && password !== confirmPasswordControl.value) {
      confirmPasswordControl.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    confirmPasswordControl?.setErrors(null);
    return null;
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
