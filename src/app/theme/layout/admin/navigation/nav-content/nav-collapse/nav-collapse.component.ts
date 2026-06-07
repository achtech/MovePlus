// angular import
import { Component, inject, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// project import
import { NavigationItem } from '../../navigation';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NavItemComponent } from '../nav-item/nav-item.component';
import { PlatformService } from 'src/app/core/services/platform.service';

@Component({
  selector: 'app-nav-collapse',
  imports: [SharedModule, NavItemComponent, RouterModule, CommonModule],
  templateUrl: './nav-collapse.component.html',
  styleUrls: ['./nav-collapse.component.scss']
})
export class NavCollapseComponent {
  private platform = inject(PlatformService);

  item = input<NavigationItem>();
  visible = false;

  navCollapse(e: MouseEvent) {
    if (!this.platform.isBrowser) {
      return;
    }

    this.visible = !this.visible;
    let parent = e.target as HTMLElement;

    if (parent?.tagName === 'SPAN') {
      parent = parent.parentElement!;
    }

    parent = parent.parentElement as HTMLElement;

    for (const section of this.platform.querySelectorAll('.pcoded-hasmenu')) {
      if (section !== parent) {
        section.classList.remove('pcoded-trigger');
      }
    }

    let first_parent = parent.parentElement;
    let pre_parent = parent.parentElement?.parentElement;
    if (first_parent?.classList.contains('pcoded-hasmenu')) {
      do {
        first_parent.classList.add('pcoded-trigger');
        first_parent = first_parent.parentElement?.parentElement ?? null;
      } while (first_parent?.classList.contains('pcoded-hasmenu'));
    } else if (pre_parent?.classList.contains('pcoded-submenu') && pre_parent.parentElement) {
      do {
        pre_parent.parentElement.classList.add('pcoded-trigger');
        pre_parent = pre_parent.parentElement?.parentElement?.parentElement ?? null;
      } while (pre_parent?.classList.contains('pcoded-submenu'));
    }

    parent.classList.toggle('pcoded-trigger');
  }
}
