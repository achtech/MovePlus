import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class PlatformService {
  private readonly platformId = inject(PLATFORM_ID);

  get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  getWindowWidth(fallback = 1024): number {
    return this.isBrowser ? window.innerWidth : fallback;
  }

  querySelector(selector: string): Element | null {
    return this.isBrowser ? document.querySelector(selector) : null;
  }

  querySelectorAll(selector: string): Element[] {
    return this.isBrowser ? Array.from(document.querySelectorAll(selector)) : [];
  }

  getBody(): HTMLElement | null {
    return this.isBrowser ? document.body : null;
  }

  closeMobileNav(): void {
    const navbar = this.querySelector('app-navigation.pcoded-navbar');
    if (navbar?.classList.contains('mob-open')) {
      navbar.classList.remove('mob-open');
    }
  }
}
