import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { CardComponent } from '../../../theme/shared/components/card/card.component';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserHydrationService } from '../../../core/utils/browser-init';
import { AuditLog, ActivityLogService } from '../activity-log.service';
import { TableLazyLoadEvent } from 'primeng/table';

@Component({
  selector: 'app-activity-log-list',
  templateUrl: './activity-log-list.component.html',
  styleUrls: ['./activity-log-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    TagModule,
    CardComponent,
    TranslateModule
  ]
})
export class ActivityLogListComponent {
  logs: AuditLog[] = [];
  loading = true;
  totalRecords = 0;
  rows = 10;

  filterUsername = '';
  filterTopic = '';
  filterDescription = '';

  readonly topics = [
    'PATIENT',
    'SESSION',
    'PAYMENT',
    'PACK',
    'SALES_STOCK',
    'EXPENSES',
    'TEAM',
    'USER'
  ];

  constructor(
    private activityLogService: ActivityLogService,
    private browserHydration: BrowserHydrationService
  ) {
    this.browserHydration.run(() => this.loadLogs({ first: 0, rows: this.rows }));
  }

  loadLogs(event: TableLazyLoadEvent): void {
    this.loading = true;
    const first = event.first ?? 0;
    const rows = event.rows ?? this.rows;
    this.rows = rows;
    const page = Math.floor(first / rows);
    const sortField = (event.sortField as string) || 'createdAt';
    const sortOrder = event.sortOrder === 1 ? 'asc' : 'desc';

    this.activityLogService
      .search({
        page,
        size: rows,
        sort: `${sortField},${sortOrder}`,
        username: this.filterUsername || undefined,
        topic: this.filterTopic || undefined,
        description: this.filterDescription || undefined
      })
      .subscribe({
        next: (result) => {
          this.logs = result.content;
          this.totalRecords = result.totalElements;
          this.loading = false;
        },
        error: () => {
          this.logs = [];
          this.totalRecords = 0;
          this.loading = false;
        }
      });
  }

  applyFilters(table: { reset: () => void }): void {
    table.reset();
    this.loadLogs({ first: 0, rows: this.rows });
  }

  clearFilters(table: { clear: () => void; reset: () => void }): void {
    this.filterUsername = '';
    this.filterTopic = '';
    this.filterDescription = '';
    table.clear();
    table.reset();
    this.loadLogs({ first: 0, rows: this.rows });
  }

  topicLabel(topic: string): string {
    return topic.replace(/_/g, ' ');
  }

  actionSeverity(action: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    switch (action) {
      case 'CREATE':
      case 'LOGIN':
        return 'success';
      case 'UPDATE':
      case 'STOCK_UPDATE':
      case 'PAYMENT_VALIDATION':
        return 'info';
      case 'DELETE':
      case 'LOGOUT':
        return 'warn';
      case 'PASSWORD_CHANGE':
      case 'STATUS_CHANGE':
        return 'contrast';
      default:
        return 'secondary';
    }
  }
}
