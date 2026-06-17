import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { CardComponent } from '../../../theme/shared/components/card/card.component';
import { FORM_DIALOG_OPTIONS } from '../../../core/constants/dialog.config';
import { BrowserHydrationService } from '../../../core/utils/browser-init';
import { DeleteConfirmService } from '../../../core/services/delete-confirm.service';
import { DialogRefreshService } from '../../../core/services/dialog-refresh.service';
import { TeamMember, TeamMemberService } from '../team-member.service';
import { TeamFormComponent } from '../team-form/team-form.component';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    TooltipModule,
    CardComponent,
    TranslateModule
  ]
})
export class TeamListComponent {
  teamMembers: TeamMember[] = [];
  showInactive = false;
  loading = true;

  constructor(
    private teamService: TeamMemberService,
    private dialog: MatDialog,
    private browserHydration: BrowserHydrationService,
    private deleteConfirm: DeleteConfirmService,
    private dialogRefresh: DialogRefreshService
  ) {
    this.browserHydration.run(() => this.loadTeamMembers());
  }

  loadTeamMembers(): void {
    this.loading = true;
    const request = this.showInactive
      ? this.teamService.getInactiveTeamMembers()
      : this.teamService.getActiveTeamMembers();

    request.subscribe({
      next: (data) => {
        this.teamMembers = Array.isArray(data) ? [...data] : [];
        this.loading = false;
      },
      error: () => {
        this.teamMembers = [];
        this.loading = false;
      }
    });
  }

  toggleInactiveView(): void {
    this.showInactive = !this.showInactive;
    this.loadTeamMembers();
  }

  addTeamMember(): void {
    this.dialogRefresh.onSave(
      this.dialog.open(TeamFormComponent, FORM_DIALOG_OPTIONS),
      () => this.loadTeamMembers()
    );
  }

  editTeamMember(member: TeamMember): void {
    this.dialogRefresh.onSave(
      this.dialog.open(TeamFormComponent, { ...FORM_DIALOG_OPTIONS, data: member }),
      () => this.loadTeamMembers()
    );
  }

  deleteTeamMember(id: number | undefined): void {
    if (!id) {
      return;
    }
    this.deleteConfirm.confirmAndDelete(
      () => this.teamService.deleteTeamMember(id),
      () => this.loadTeamMembers()
    );
  }

  toggleStatus(member: TeamMember): void {
    if (!member.id) {
      return;
    }
    const request =
      member.status === 'ACTIVE'
        ? this.teamService.deactivateTeamMember(member.id)
        : this.teamService.activateTeamMember(member.id);
    request.subscribe(() => this.loadTeamMembers());
  }

  clear(table: { clear: () => void }): void {
    table.clear();
  }
}
