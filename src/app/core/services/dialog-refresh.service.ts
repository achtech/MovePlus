import { inject, Injectable, NgZone } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { refreshOnDialogSave } from '../utils/dialog-refresh';

@Injectable({ providedIn: 'root' })
export class DialogRefreshService {
  private ngZone = inject(NgZone);

  onSave(dialogRef: MatDialogRef<unknown>, reload: () => void): Subscription {
    return refreshOnDialogSave(dialogRef, reload, this.ngZone);
  }
}
