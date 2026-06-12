import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { CardComponent } from '../../theme/shared/components/card/card.component';
import { AppCurrencyPipe } from '../../core/pipes/app-currency.pipe';
import { APP_CURRENCY_SYMBOL } from '../../core/constants/currency.config';
import { runAfterBrowserHydration } from '../../core/utils/browser-init';

import { PatientService } from '../patients/patient.service';
import { SeanceService } from '../seances/seance.service';
import { PaymentService } from '../payments/payment.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ChartModule, CardComponent, TranslateModule, AppCurrencyPipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private patientService = inject(PatientService);
  private seanceService = inject(SeanceService);
  private paymentService = inject(PaymentService);
  private translate = inject(TranslateService);
  private langSub?: Subscription;

  totalPatients = 0;

  seancesToday = 0;
  seancesWeek = 0;
  seancesMonth = 0;

  paymentsToday = 0;
  paymentsWeek = 0;
  paymentsMonth = 0;

  allPayments: any[] = [];
  allSeances: any[] = [];
  allPatients: any[] = [];

  expensesByMonth: number[] = [500, 450, 600, 700, 650, 800, 750, 900, 850, 950, 1000, 1100];

  lineStylesData: any = { labels: [], datasets: [] };
  lineStylesOptions: any;
  barSeancesData: any;
  barSeancesOptions: any;

  validatedByMonth: number[] = new Array(12).fill(0);
  pendingByMonth: number[] = new Array(12).fill(0);

  showValidated = true;
  showPending = true;
  showExpenses = true;

  seancesYesterday: Array<{ patientName: string; time: string; type: string }> = [];
  seancesTodayList: Array<{ patientName: string; time: string; type: string }> = [];
  seancesTomorrow: Array<{ patientName: string; time: string; type: string }> = [];

  constructor() {
    runAfterBrowserHydration(() => this.loadStats());
  }

  ngOnInit() {
    this.initChartOptions();
    this.langSub = this.translate.onLangChange.subscribe(() => {
      this.updateChartLabels();
      this.updateLineData();
    });
  }

  ngOnDestroy() {
    this.langSub?.unsubscribe();
  }

  loadStats() {
    this.patientService.getPatients().subscribe((patients) => {
      this.allPatients = patients || [];
      this.totalPatients = this.allPatients.length;
      this.computeSeanceDayLists();
    });

    this.seanceService.getSeances().subscribe((seances) => {
      this.allSeances = seances || [];

      const now = new Date();
      const startOfWeek = this.getStartOfWeek(now);
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      this.seancesToday = this.allSeances.filter((s) => this.isSameDay(new Date(s.dateTime), now)).length;
      this.seancesWeek = this.allSeances.filter((s) => new Date(s.dateTime) >= startOfWeek).length;
      this.seancesMonth = this.allSeances.filter((s) => new Date(s.dateTime) >= startOfMonth).length;

      this.computeSeanceDayLists();
    });

    this.paymentService.getPayments().subscribe((payments) => {
      this.allPayments = payments || [];

      const now = new Date();
      const startOfWeek = this.getStartOfWeek(now);
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      this.paymentsToday = this.allPayments
        .filter((p) => this.isSameDay(new Date(p.date), now))
        .reduce((sum, p) => sum + (p.amount || 0), 0);

      this.paymentsWeek = this.allPayments
        .filter((p) => new Date(p.date) >= startOfWeek)
        .reduce((sum, p) => sum + (p.amount || 0), 0);

      this.paymentsMonth = this.allPayments
        .filter((p) => new Date(p.date) >= startOfMonth)
        .reduce((sum, p) => sum + (p.amount || 0), 0);

      this.computeMonthlyPaymentSeries();
      this.updateLineData();
    });

    this.barSeancesData = {
      labels: this.getMonthLabels(),
      datasets: [
        {
          label: this.translate.instant('dashboard.chartSeances'),
          data: [40, 35, 50, 60, 70, 65, 80, 90, 75, 85, 95, 110],
          backgroundColor: '#04a9f5'
        }
      ]
    };
    this.barSeancesOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'top' } },
      scales: { y: { beginAtZero: true } }
    };
  }

  computeSeanceDayLists() {
    const patientMap = new Map<number, string>();
    this.allPatients.forEach((p) => {
      const id = (p as any).id;
      const name = `${(p as any).firstName || ''} ${(p as any).lastName || ''}`.trim();
      patientMap.set(id, name || '—');
    });

    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    const formatTime = (iso: string) => {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return '—';
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const mapSeance = (s: any) => ({
      patientName: patientMap.get(s.patientId) || `Patient #${s.patientId}`,
      time: formatTime(s.dateTime),
      type: s.type || '—'
    });

    this.seancesYesterday = this.allSeances.filter((s) => this.isSameDay(new Date(s.dateTime), yesterday)).map(mapSeance);

    this.seancesTodayList = this.allSeances.filter((s) => this.isSameDay(new Date(s.dateTime), now)).map(mapSeance);

    this.seancesTomorrow = this.allSeances.filter((s) => this.isSameDay(new Date(s.dateTime), tomorrow)).map(mapSeance);

    const sortByTime = (a: any, b: any) => (a.time > b.time ? 1 : -1);
    this.seancesYesterday.sort(sortByTime);
    this.seancesTodayList.sort(sortByTime);
    this.seancesTomorrow.sort(sortByTime);
  }

  initChartOptions() {
    const currencyLabel = (context: { parsed: { y: number }; dataset: { label?: string } }) =>
      `${context.dataset.label}: ${context.parsed.y.toLocaleString('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${APP_CURRENCY_SYMBOL}`;

    this.lineStylesOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: { label: currencyLabel }
        }
      },
      interaction: { mode: 'nearest', axis: 'x', intersect: false },
      scales: {
        x: { grid: { display: false } },
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0,
            callback: (value: string | number) => `${value} ${APP_CURRENCY_SYMBOL}`
          }
        }
      }
    };

    this.lineStylesData.labels = this.getMonthLabels();
  }

  private getMonthLabels(): string[] {
    const keys = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    return keys.map((k) => this.translate.instant(`common.months.${k}`));
  }

  private updateChartLabels(): void {
    const labels = this.getMonthLabels();
    this.lineStylesData = { ...this.lineStylesData, labels };
    if (this.barSeancesData?.datasets?.[0]) {
      this.barSeancesData = {
        labels,
        datasets: [
          {
            ...this.barSeancesData.datasets[0],
            label: this.translate.instant('dashboard.chartSeances')
          }
        ]
      };
    }
  }

  computeMonthlyPaymentSeries() {
    this.validatedByMonth = new Array(12).fill(0);
    this.pendingByMonth = new Array(12).fill(0);

    this.allPayments.forEach((p) => {
      const d = new Date(p.date);
      if (isNaN(d.getTime())) return;
      const m = d.getMonth();
      const amount = Number(p.amount || 0);
      if (p.status === 'PENDING') {
        this.pendingByMonth[m] += amount;
      } else {
        this.validatedByMonth[m] += amount;
      }
    });
  }

  updateLineData() {
    const labels = this.getMonthLabels();
    const datasets: any[] = [];

    if (this.showValidated) {
      datasets.push({
        label: this.translate.instant('dashboard.chartValidatedPayments'),
        data: this.validatedByMonth,
        fill: false,
        borderColor: '#04a9f5',
        backgroundColor: 'rgba(4,169,245,0.06)',
        tension: 0.3,
        borderWidth: 3,
        pointRadius: 4,
        pointBackgroundColor: '#04a9f5'
      });
    }

    if (this.showPending) {
      datasets.push({
        label: this.translate.instant('dashboard.chartPendingPayments'),
        data: this.pendingByMonth,
        fill: false,
        borderColor: '#FFA726',
        backgroundColor: 'rgba(255,167,38,0.06)',
        borderDash: [10, 6],
        tension: 0.3,
        borderWidth: 3,
        pointRadius: 4,
        pointBackgroundColor: '#FFA726'
      });
    }

    if (this.showExpenses) {
      datasets.push({
        label: this.translate.instant('dashboard.chartClinicExpenses'),
        data: this.expensesByMonth,
        fill: true,
        backgroundColor: 'rgba(117,117,117,0.18)',
        borderColor: '#757575',
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: '#757575'
      });
    }

    this.lineStylesData = { labels, datasets };
  }

  onToggleChange() {
    this.updateLineData();
  }

  isSameDay(d1: Date, d2: Date): boolean {
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
  }

  getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }
}
