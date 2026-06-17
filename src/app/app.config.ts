import { ApplicationConfig, provideAppInitializer, inject, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { firstValueFrom } from 'rxjs';

import { routes } from './app-routing.module';
import { provideClientHydration } from '@angular/platform-browser';
import { ConfirmationService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeng/themes/lara';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { changeDetectionInterceptor } from './core/interceptors/change-detection.interceptor';
import { LanguageService } from './core/services/language.service';
import { PlatformService } from './core/services/platform.service';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { panelClass: ['datta-dialog'], autoFocus: false } },
    provideBrowserGlobalErrorListeners(),
    provideAnimations(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, changeDetectionInterceptor])),
    provideClientHydration(),
    providePrimeNG({
      theme: {
        preset: Lara
      }
    }),
    provideTranslateService({
      fallbackLang: 'fr',
      lang: 'fr',
      loader: provideTranslateHttpLoader({
        prefix: '/assets/i18n/',
        suffix: '.json'
      })
    }),
    provideAppInitializer(() => {
      const languageService = inject(LanguageService);
      const platform = inject(PlatformService);
      if (!platform.isBrowser) {
        return Promise.resolve();
      }
      return firstValueFrom(languageService.init());
    }),
    ConfirmationService
  ]
};
