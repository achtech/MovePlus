// angular import
import { Component, inject, output } from '@angular/core';
import { Location } from '@angular/common';

// project import
import { environment } from 'src/environments/environment';
import { NavigationItem, NavigationItems } from '../navigation';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NavGroupComponent } from './nav-group/nav-group.component';
import { PlatformService } from 'src/app/core/services/platform.service';

@Component({
  selector: 'app-nav-content',
  imports: [SharedModule, NavGroupComponent],
  templateUrl: './nav-content.component.html',
  styleUrls: ['./nav-content.component.scss']
})
export class NavContentComponent {
  private location = inject(Location);
  private platform = inject(PlatformService);

  title = 'Demo application for version numbering';
  currentApplicationVersion = environment.appVersion;

  navigations!: NavigationItem[];
  wrapperWidth = 0;
  windowWidth: number;

  NavCollapsedMob = output();

  constructor() {
    this.navigations = NavigationItems;
    this.windowWidth = this.platform.getWindowWidth();
  }

  fireOutClick() {
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
    const last_parent = up_parent?.parentElement;

    if (parent?.classList.contains('pcoded-hasmenu')) {
      parent.classList.add('pcoded-trigger', 'active');
    } else if (up_parent?.classList.contains('pcoded-hasmenu')) {
      up_parent.classList.add('pcoded-trigger', 'active');
    } else if (last_parent?.classList.contains('pcoded-hasmenu')) {
      last_parent.classList.add('pcoded-trigger', 'active');
    }
  }
}
