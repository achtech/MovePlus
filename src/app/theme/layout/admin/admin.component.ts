// angular import
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// project import
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { NavigationComponent } from './navigation/navigation.component';
import { Footer } from './footer/footer';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PlatformService } from 'src/app/core/services/platform.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { BrowserHydrationService } from 'src/app/core/utils/browser-init';

@Component({
  selector: 'app-admin',
  imports: [NavBarComponent, NavigationComponent, RouterModule, CommonModule, Footer, ConfirmDialogModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  private platform = inject(PlatformService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private browserHydration = inject(BrowserHydrationService);

  navCollapsed = false;
  navCollapsedMob: boolean;
  windowWidth: number;

  constructor() {
    this.windowWidth = this.platform.getWindowWidth();
    this.navCollapsedMob = false;

    this.browserHydration.run(() => {
      if (!this.authService.isAuthenticated()) {
        this.router.navigate(['/login']);
      }
    });
  }

  navMobClick() {
    if (!this.platform.isBrowser) {
      return;
    }

    this.navCollapsedMob = !this.navCollapsedMob;
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeMenu();
    }
  }

  closeMenu() {
    this.platform.closeMobileNav();
  }
}
