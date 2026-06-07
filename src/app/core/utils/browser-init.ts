import { afterNextRender } from '@angular/core';

/** Run after client hydration so localStorage/JWT and HTTP calls are available (SSR-safe). */
export function runAfterBrowserHydration(callback: () => void): void {
  afterNextRender(callback);
}
