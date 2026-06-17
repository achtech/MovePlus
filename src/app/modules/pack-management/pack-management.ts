import { Component, ChangeDetectorRef } from '@angular/core';
import { MatDialog  } from  '@angular/material/dialog';
import { PackService,  Pack  }  from './pack.service';
import { PackFormDialogComponent } from './pack-form-dialog/pack-form-dialog.component';
import { PatientPackService } from './patient-pack.service';
import { PackSubscribersDialogComponent } from './pack-subscribers-dialog/pack-subscribers-dialog.component';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { CardComponent } from '../../theme/shared/components/card/card.component';
import { TranslateModule } from '@ngx-translate/core';
import { AppCurrencyPipe } from '../../core/pipes/app-currency.pipe';
import { FORM_DIALOG_OPTIONS } from '../../core/constants/dialog.config';
import { BrowserHydrationService } from '../../core/utils/browser-init';
import { DeleteConfirmService } from '../../core/services/delete-confirm.service';
import { DialogRefreshService } from '../../core/services/dialog-refresh.service';

@Component({
  selector: 'app-pack-management',
  templateUrl: './pack-management.html',
  styleUrl: './pack-management.scss',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, InputTextModule, IconFieldModule, InputIconModule, TagModule, CardComponent, TranslateModule, AppCurrencyPipe]
})
export class PackManagement {
  packs: Pack[] = [];
  activeCounts: Record<number, number> = {};
  loading: boolean = true;
  
  constructor(
    private packService: PackService,
    private patientPackService: PatientPackService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private browserHydration: BrowserHydrationService,
    private deleteConfirm: DeleteConfirmService,
    private dialogRefresh: DialogRefreshService
  ) {
    this.browserHydration.run(() => this.loadPacks());
  }

  loadPacks() {
    this.loading = true;
    this.packService.getPacks().subscribe({
      next: (data) => {
        this.packs = [...data];
        this.loading = false;
        this.cdr.markForCheck();
        this.loadActiveCounts();
      },
      error: (error) => {
        console.error('Error loading packs:', error);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  loadActiveCounts(): void {
    this.patientPackService.getActiveSubscriberCounts().subscribe((counts) => {
      this.activeCounts = counts;
      this.cdr.markForCheck();
    });
  }

  getActiveCount(packId?: number): number {
    return packId ? this.activeCounts[packId] ?? 0 : 0;
  }

  showSubscribers(pack: Pack): void {
    if (!pack.id) {
      return;
    }
    this.patientPackService.getActiveSubscribersByPack(pack.id).subscribe((subscribers) => {
      this.dialog.open(PackSubscribersDialogComponent, {
        ...FORM_DIALOG_OPTIONS,
        width: '560px',
        data: { packName: pack.nom, subscribers }
      });
    });
  }

  addPack(): void {
    this.dialogRefresh.onSave(
      this.dialog.open(PackFormDialogComponent, FORM_DIALOG_OPTIONS),
      () => this.loadPacks()
    );
  }

  editPack(pack: Pack): void {
    this.dialogRefresh.onSave(
      this.dialog.open(PackFormDialogComponent, { ...FORM_DIALOG_OPTIONS, data: pack }),
      () => this.loadPacks()
    );
  }

  deletePack(id: number): void {
    this.deleteConfirm.confirmAndDelete(
      () => this.packService.deletePack(id),
      () => this.loadPacks()
    );
  }
}
