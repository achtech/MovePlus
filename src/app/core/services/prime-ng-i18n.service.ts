import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNG } from 'primeng/config';

@Injectable({ providedIn: 'root' })
export class PrimeNgI18nService {
  private readonly primeng = inject(PrimeNG);
  private readonly translate = inject(TranslateService);

  sync(): void {
    this.translate
      .get(['pagination.previous', 'pagination.next', 'pagination.rowsPerPage'])
      .subscribe((t) => {
        this.primeng.setTranslation({
          aria: {
            prevPageLabel: t['pagination.previous'],
            previousPageLabel: t['pagination.previous'],
            nextPageLabel: t['pagination.next'],
            rowsPerPageLabel: t['pagination.rowsPerPage']
          }
        });
      });
  }
}
