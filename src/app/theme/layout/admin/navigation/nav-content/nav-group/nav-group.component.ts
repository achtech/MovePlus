// angular import
import { Component, OnInit, inject, input } from '@angular/core';
import { Location } from '@angular/common';

// project import
import { NavigationItem } from '../../navigation';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NavItemComponent } from '../nav-item/nav-item.component';
import { NavCollapseComponent } from '../nav-collapse/nav-collapse.component';
import { PlatformService } from 'src/app/core/services/platform.service';

@Component({
  selector: 'app-nav-group',
  imports: [SharedModule, NavItemComponent, NavCollapseComponent],
  templateUrl: './nav-group.component.html',
  styleUrls: ['./nav-group.component.scss']
})
export class NavGroupComponent implements OnInit {
  private location = inject(Location);
  private platform = inject(PlatformService);

  readonly item = input<NavigationItem>();

  ngOnInit() {
    if (!this.platform.isBrowser) {
      return;
    }

    let current_url = this.location.path();
    const baseHref = (this.location as { _baseHref?: string })._baseHref;
    if (baseHref) {
      current_url = baseHref + this.location.path();
    }

    const link = "a.nav-link[ href='" + current_url + "' ]";
    const ele = this.platform.querySelector(link);
    if (!ele) {
      return;
    }

    const parent = ele.parentElement;
    const up_parent = parent?.parentElement?.parentElement;
    const pre_parent = up_parent?.parentElement;
    const last_parent = up_parent?.parentElement?.parentElement?.parentElement?.parentElement;

    if (parent?.classList.contains('pcoded-hasmenu')) {
      parent.classList.add('pcoded-trigger', 'active');
    } else if (up_parent?.classList.contains('pcoded-hasmenu')) {
      up_parent.classList.add('pcoded-trigger', 'active');
    } else if (pre_parent?.classList.contains('pcoded-hasmenu')) {
      pre_parent.classList.add('pcoded-trigger', 'active');
    }

    if (last_parent?.classList.contains('pcoded-hasmenu')) {
      last_parent.classList.add('pcoded-trigger');
      if (pre_parent?.classList.contains('pcoded-hasmenu')) {
        pre_parent.classList.add('pcoded-trigger');
      }
      last_parent.classList.add('active');
    }
  }
}
