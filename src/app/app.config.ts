import { ApplicationConfig, provideAppInitializer, inject, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { firstValueFrom } from 'rxjs';

import { routes } from './app-routing.module';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeng/themes/lara';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { LanguageService } from './core/services/language.service';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { panelClass: ['datta-dialog'], autoFocus: false } },
    provideBrowserGlobalErrorListeners(),
    provideAnimations(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor]), withFetch()),
    provideClientHydration(withEventReplay()),
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
      return firstValueFrom(languageService.init());
    })
  ]
};
