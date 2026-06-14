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
import { runAfterBrowserHydration } from '../../../core/utils/browser-init';
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
    private dialog: MatDialog
  ) {
    runAfterBrowserHydration(() => this.loadTeamMembers());
  }

  loadTeamMembers(): void {
    this.loading = true;
    const request = this.showInactive
      ? this.teamService.getInactiveTeamMembers()
      : this.teamService.getActiveTeamMembers();

    request.subscribe({
      next: (data) => {
        this.teamMembers = Array.isArray(data) ? data : [];
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
    this.dialog.open(TeamFormComponent, FORM_DIALOG_OPTIONS).afterClosed().subscribe((result) => {
      if (result) {
        this.loadTeamMembers();
      }
    });
  }

  editTeamMember(member: TeamMember): void {
    this.dialog
      .open(TeamFormComponent, { ...FORM_DIALOG_OPTIONS, data: member })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.loadTeamMembers();
        }
      });
  }

  deleteTeamMember(id: number | undefined): void {
    if (!id || !confirm('Supprimer ce membre de l\'équipe ?')) {
      return;
    }
    this.teamService.deleteTeamMember(id).subscribe(() => this.loadTeamMembers());
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
