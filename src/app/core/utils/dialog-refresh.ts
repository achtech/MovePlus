import { NgZone } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

/** Reload list data when a form dialog closes after a successful save. */
export function refreshOnDialogSave(
  dialogRef: MatDialogRef<unknown>,
  reload: () => void,
  ngZone: NgZone
): Subscription {
  return dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      ngZone.run(() => reload());
    }
  });
}
