// angular import
import { Component, Input, inject, output } from '@angular/core';
import { RouterModule } from '@angular/router';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { PlatformService } from 'src/app/core/services/platform.service';

@Component({
  selector: 'app-nav-logo',
  imports: [SharedModule, RouterModule],
  templateUrl: './nav-logo.component.html',
  styleUrls: ['./nav-logo.component.scss']
})
export class NavLogoComponent {
  private platform = inject(PlatformService);

  @Input() navCollapsed = false;
  NavCollapse = output();
  windowWidth: number;

  constructor() {
    this.windowWidth = this.platform.getWindowWidth();
  }

  navCollapse() {
    if (this.windowWidth >= 992) {
      this.navCollapsed = !this.navCollapsed;
      this.NavCollapse.emit();
    }
  }
}
