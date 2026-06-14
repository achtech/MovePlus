import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PatientPack } from '../patient-pack.service';

@Component({
  selector: 'app-pack-subscribers-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, TranslateModule],
  template: `
    <h2 mat-dialog-title>{{ 'pages.packs.subscribersTitle' | translate }} — {{ data.packName }}</h2>
    <mat-dialog-content>
      @if (data.subscribers.length === 0) {
        <p class="empty-msg">{{ 'pages.packs.noSubscribers' | translate }}</p>
      } @else {
        <ul class="subscriber-list">
          @for (s of data.subscribers; track s.id) {
            <li>
              <strong>{{ s.patientFirstName }} {{ s.patientLastName }}</strong>
              <span class="meta">
                {{ 'pages.packs.remainingSessions' | translate }}: {{ s.remainingSessions }} / {{ s.totalSessions }}
                · {{ s.paymentStatus }}
              </span>
            </li>
          }
        </ul>
      }
    </mat-dialog-content>
    <mat-dialog-actions align="end" class="datta-dialog-actions">
      <button type="button" class="btn btn-secondary" (click)="close()">{{ 'common.close' | translate }}</button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .subscriber-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .subscriber-list li {
        padding: 0.75rem 0;
        border-bottom: 1px solid #e2e8f0;
      }
      .meta {
        display: block;
        font-size: 0.85rem;
        color: #64748b;
        margin-top: 0.25rem;
      }
      .empty-msg {
        color: #64748b;
        margin: 0;
      }
    `
  ]
})
export class PackSubscribersDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { packName: string; subscribers: PatientPack[] },
    private dialogRef: MatDialogRef<PackSubscribersDialogComponent>
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
