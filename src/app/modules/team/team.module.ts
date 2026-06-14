import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamRoutingModule } from './team-routing.module';
import { TeamFormComponent } from './team-form/team-form.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, TeamRoutingModule, TeamFormComponent]
})
export class TeamModule {}
