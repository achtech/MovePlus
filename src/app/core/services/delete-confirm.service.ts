import { Injectable, inject, NgZone } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DeleteConfirmService {
  private confirmation = inject(ConfirmationService);
  private translate = inject(TranslateService);
  private ngZone = inject(NgZone);

  confirmAndDelete(
    deleteFn: () => Observable<unknown>,
    onSuccess: () => void,
    messageKey = 'common.deleteConfirm',
    headerKey = 'common.deleteTitle'
  ): void {
    this.confirmation.confirm({
      message: this.translate.instant(messageKey),
      header: this.translate.instant(headerKey),
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary p-button-outlined',
      acceptLabel: this.translate.instant('common.yes'),
      rejectLabel: this.translate.instant('common.no'),
      accept: () => {
        deleteFn().subscribe({
          next: () => this.ngZone.run(() => onSuccess()),
          error: (err) => console.error('Delete failed:', err)
        });
      }
    });
  }
}
