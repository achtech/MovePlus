import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BrowserHydrationService {
  /** Run immediately on the client (no render delay). Skipped during SSR. */
  run(callback: () => void): void {
    if (typeof window === 'undefined') {
      return;
    }
    queueMicrotask(callback);
  }
}
