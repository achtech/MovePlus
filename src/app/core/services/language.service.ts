import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, tap } from 'rxjs';
import { PlatformService } from './platform.service';
import { PrimeNgI18nService } from './prime-ng-i18n.service';

export interface AppLanguage {
  code: string;
  labelKey: string;
  flagSrc: string;
  shortLabel: string;
}

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly translate = inject(TranslateService);
  private readonly platform = inject(PlatformService);
  private readonly primeNgI18n = inject(PrimeNgI18nService);
  private readonly storageKey = 'app_language';

  readonly languages: AppLanguage[] = [
    { code: 'fr', labelKey: 'languages.fr', flagSrc: 'assets/images/flags/fr.svg', shortLabel: 'Français' },
    { code: 'es', labelKey: 'languages.es', flagSrc: 'assets/images/flags/es.svg', shortLabel: 'Espagnol' },
    { code: 'en', labelKey: 'languages.en', flagSrc: 'assets/images/flags/gb.svg', shortLabel: 'English' },
    { code: 'ar', labelKey: 'languages.ar', flagSrc: 'assets/images/flags/ma.svg', shortLabel: 'Arabic' }
  ];

  init(): Observable<unknown> {
    const lang = this.getStoredLanguage() ?? 'fr';
    return this.setLanguage(lang);
  }

  get currentLanguage(): string {
    return this.translate.getCurrentLang() || this.translate.getFallbackLang() || 'fr';
  }

  setLanguage(code: string): Observable<unknown> {
    return this.translate.use(code).pipe(
      tap(() => {
        this.primeNgI18n.sync();
        if (this.platform.isBrowser) {
          localStorage.setItem(this.storageKey, code);
          this.applyDocumentLanguage(code);
        }
      })
    );
  }

  private getStoredLanguage(): string | null {
    if (!this.platform.isBrowser) {
      return null;
    }
    return localStorage.getItem(this.storageKey);
  }

  private applyDocumentLanguage(lang: string): void {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.body.classList.toggle('rtl-layout', lang === 'ar');
  }
}
