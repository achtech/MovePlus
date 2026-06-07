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

  closeOtherMenu(event: MouseEvent) {
    if (!this.platform.isBrowser) {
      return;
    }

    const ele = event.target as HTMLElement;
    if (!ele) {
      return;
    }

    const parent = ele.parentElement as HTMLElement;
    const up_parent = ((parent.parentElement as HTMLElement).parentElement as HTMLElement).parentElement as HTMLElement;
    const last_parent = (up_parent.parentElement as HTMLElement).parentElement as HTMLElement;

    if (last_parent.classList.contains('pcoded-submenu')) {
      up_parent.classList.remove('pcoded-trigger', 'active');
    } else {
      for (const section of this.platform.querySelectorAll('.pcoded-hasmenu')) {
        section.classList.remove('active', 'pcoded-trigger');
      }
    }

    if (parent.classList.contains('pcoded-hasmenu')) {
      parent.classList.add('pcoded-trigger', 'active');
    } else if (up_parent.classList.contains('pcoded-hasmenu')) {
      up_parent.classList.add('pcoded-trigger', 'active');
    } else if (last_parent.classList.contains('pcoded-hasmenu')) {
      last_parent.classList.add('pcoded-trigger', 'active');
    }

    this.platform.closeMobileNav();
  }
}
