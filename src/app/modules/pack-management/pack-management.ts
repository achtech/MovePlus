import { Component, ChangeDetectorRef } from '@angular/core';
import { MatDialog  } from  '@angular/material/dialog';
import { PackService,  Pack  }  from './pack.service';
import { PackFormDialogComponent } from './pack-form-dialog/pack-form-dialog.component';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { CardComponent } from '../../theme/shared/components/card/card.component';
import { TranslateModule } from '@ngx-translate/core';
import { FORM_DIALOG_OPTIONS } from '../../core/constants/dialog.config';
import { runAfterBrowserHydration } from '../../core/utils/browser-init';

@Component({
  selector: 'app-pack-management',
  templateUrl: './pack-management.html',
  styleUrl: './pack-management.scss',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, InputTextModule, IconFieldModule, InputIconModule, TagModule, CardComponent, TranslateModule]
})
export class PackManagement {
  packs: Pack[] = [];
  loading: boolean = true;
  
  constructor(
    private packService: PackService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    runAfterBrowserHydration(() => this.loadPacks());
  }

  loadPacks() {
    this.loading = true;
    this.packService.getPacks().subscribe({
      next: (data) => {
        this.packs = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading packs:', error);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  addPack(): void {
    const dialogRef = this.dialog.open(PackFormDialogComponent, FORM_DIALOG_OPTIONS);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPacks();
      }
    });
  }

  editPack(pack: Pack): void {
    const dialogRef = this.dialog.open(PackFormDialogComponent, { ...FORM_DIALOG_OPTIONS, data: pack });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPacks();
      }
    });
  }

  deletePack(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce pack?')) {
      this.packService.deletePack(id).subscribe({
        next: () => {
          this.loadPacks();
        },
        error: (error) => console.error('Error deleting pack:', error)
      });
    }
  }
}
