// angular import
import { Component, inject, output } from '@angular/core';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NavLogoComponent } from './nav-logo/nav-logo.component';
import { NavContentComponent } from './nav-content/nav-content.component';
import { PlatformService } from 'src/app/core/services/platform.service';

@Component({
  selector: 'app-navigation',
  imports: [SharedModule, NavLogoComponent, NavContentComponent],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  private platform = inject(PlatformService);

  NavCollapse = output();
  NavCollapsedMob = output();
  navCollapsed = false;
  navCollapsedMob: boolean;
  windowWidth: number;

  constructor() {
    this.windowWidth = this.platform.getWindowWidth();
    this.navCollapsedMob = false;
  }

  navCollapse() {
    if (this.windowWidth >= 992) {
      this.navCollapsed = !this.navCollapsed;
      this.NavCollapse.emit();
    }
  }

  navCollapseMob() {
    if (this.windowWidth < 992) {
      this.NavCollapsedMob.emit();
    }
  }
}
