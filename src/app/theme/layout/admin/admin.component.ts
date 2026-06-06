// angular import
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// project import
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { NavigationComponent } from './navigation/navigation.component';
import { ConfigurationComponent } from 'src/app/theme/layout/admin/configuration/configuration.component';
import { BreadcrumbsComponent } from '../../shared/components/breadcrumbs/breadcrumbs.component';
import { Footer } from './footer/footer';

@Component({
  selector: 'app-admin',
  imports: [NavBarComponent, NavigationComponent, RouterModule, CommonModule, ConfigurationComponent, BreadcrumbsComponent, Footer],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  // public props
  navCollapsed = false;
  navCollapsedMob: boolean;
  windowWidth: number;

  // constructor
  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.windowWidth = isPlatformBrowser(this.platformId) ? window.innerWidth : 1024;
    this.navCollapsedMob = false;
  }

  // public method
  navMobClick() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const navbar = document.querySelector('app-navigation.pcoded-navbar');
    if (!navbar) {
      return;
    }

    if (this.navCollapsedMob && !navbar.classList.contains('mob-open')) {
      this.navCollapsedMob = !this.navCollapsedMob;
      setTimeout(() => {
        this.navCollapsedMob = !this.navCollapsedMob;
      }, 100);
    } else {
      this.navCollapsedMob = !this.navCollapsedMob;
    }
  }

  // this is for eslint rule
  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeMenu();
    }
  }

  closeMenu() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const navbar = document.querySelector('app-navigation.pcoded-navbar');
    if (navbar?.classList.contains('mob-open')) {
      navbar.classList.remove('mob-open');
    }
  }
}
