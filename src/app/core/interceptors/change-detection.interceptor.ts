import { ApplicationRef, inject, NgZone } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

/** Ensures the UI updates after HTTP requests (add/update/delete reload lists). */
export const changeDetectionInterceptor: HttpInterceptorFn = (req, next) => {
  const ngZone = inject(NgZone);
  const appRef = inject(ApplicationRef);

  return next(req).pipe(
    finalize(() => {
      ngZone.run(() => appRef.tick());
    })
  );
};
