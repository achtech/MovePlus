import { EnvironmentInjector, Injectable, afterNextRender, inject, runInInjectionContext } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BrowserHydrationService {
  private readonly injector = inject(EnvironmentInjector);

  /** Run after client hydration (SSR-safe). Safe to call from ngOnInit or constructor. */
  run(callback: () => void): void {
    runInInjectionContext(this.injector, () => afterNextRender(callback));
  }
}
