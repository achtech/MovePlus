import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { TeamMember, TeamMemberService } from '../team-member.service';

@Component({
  selector: 'app-team-form',
  templateUrl: './team-form.component.html',
  styleUrls: ['./team-form.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule]
})
export class TeamFormComponent {
  form: FormGroup;
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
    if (!this.form.valid) {
      return;
    }

    const member: TeamMember = {
      ...this.data,
      ...this.form.value,
      endDate: this.form.value.endDate || null
    };

    if (this.data?.id) {
      this.teamService.updateTeamMember(this.data.id, member).subscribe(() => this.dialogRef.close(true));
    } else {
      this.teamService.createTeamMember(member).subscribe(() => this.dialogRef.close(true));
    }
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
