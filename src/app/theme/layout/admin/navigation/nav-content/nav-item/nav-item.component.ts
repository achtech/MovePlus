// angular import
import { Component, inject, input } from '@angular/core';
import { RouterModule } from '@angular/router';

// project import
import { NavigationItem } from '../../navigation';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { PlatformService } from 'src/app/core/services/platform.service';

@Component({
  selector: 'app-nav-item',
  imports: [SharedModule, RouterModule],
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.scss']
})
export class NavItemComponent {
  private platform = inject(PlatformService);

  item = input<NavigationItem>();

  onNavClick(): void {
    if (this.platform.isBrowser) {
      this.platform.closeMobileNav();
    }
  }
}
