import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { TeamMember, TeamMemberService } from '../team-member.service';
import {
  getFormValidationMessage,
  getApiErrorMessage,
  isFieldInvalid,
  getFieldErrorMessage,
  FORM_SAVE_ERROR
} from '../../../core/utils/form-submit.utils';

@Component({
  selector: 'app-team-form',
  templateUrl: './team-form.component.html',
  styleUrls: ['./team-form.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule]
})
export class TeamFormComponent {
  form: FormGroup;
  submitError = '';

  fieldInvalid = (name: string) => isFieldInvalid(this.form, name);
  fieldError = (name: string, label: string) => getFieldErrorMessage(this.form, name, label);
  roles = ['Kinésithérapeute', 'Assistant', 'Trainer', 'Admin'];

  constructor(
    private fb: FormBuilder,
    private teamService: TeamMemberService,
    private dialogRef: MatDialogRef<TeamFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TeamMember | null
  ) {
    this.form = this.fb.group({
      fullName: [data?.fullName || '', Validators.required],
      phoneNumber: [data?.phoneNumber || '', Validators.required],
      startDate: [data?.startDate || new Date().toISOString().slice(0, 10), Validators.required],
      endDate: [data?.endDate || ''],
      specialty: [data?.specialty || ''],
      role: [data?.role || '', Validators.required],
      status: [data?.status || 'ACTIVE', Validators.required]
    });
  }

  save(): void {
    this.submitError = '';
    const validationError = getFormValidationMessage(this.form, {
      fullName: 'nom complet',
      phoneNumber: 'téléphone',
      startDate: 'date de début',
      role: 'rôle',
      status: 'statut'
    });
    if (validationError) {
      this.submitError = validationError;
      return;
    }

    const member: TeamMember = {
      ...this.data,
      ...this.form.value,
      endDate: this.form.value.endDate || null
    };

    const request$ = this.data?.id
      ? this.teamService.updateTeamMember(this.data.id, member)
      : this.teamService.createTeamMember(member);

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
