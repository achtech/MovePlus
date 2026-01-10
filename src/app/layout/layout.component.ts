import  {  Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef }  from  '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
    selector:  'app-layout',
    templateUrl:  './layout.component.html',
    styleUrls: ['./layout.component.scss'],
    standalone: true,
    imports: [CommonModule, MatToolbarModule, MatSidenavModule, MatListModule, MatIconModule, MatButtonModule]
})
export  class  LayoutComponent implements OnInit, AfterViewInit, OnDestroy {
    isSidebarOpen  =  true;
    currentComponent: any = null;
    private routerSubscription: Subscription | null = null;

    constructor(private router: Router, private cdr: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.routerSubscription = this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                this.loadComponentForRoute(event.urlAfterRedirects);
            });
    }

    ngAfterViewInit(): void {
        // Load initial component
        this.loadComponentForRoute(this.router.url);
    }

    ngOnDestroy(): void {
        if (this.routerSubscription) {
            this.routerSubscription.unsubscribe();
        }
    }

    toggleSidebar():  void  {
        this.isSidebarOpen  =  !this.isSidebarOpen;
    }

    navigateTo(path: string): void {
        this.router.navigate([path]);
    }

    private async loadComponentForRoute(url: string): Promise<void> {
        // Extract path from URL
        const path = url.split('/')[1] || 'dashboard';

        // Load component based on path
        switch (path) {
            case 'dashboard':
                const { DashboardComponent } = await import('../modules/dashboard/dashboard.component');
                this.currentComponent = DashboardComponent;
                break;
            case 'patients':
                const { PatientListComponent } = await import('../modules/patients/patient-list/patient-list.component');
                this.currentComponent = PatientListComponent;
                break;
            case 'seances':
                const { SeanceListComponent } = await import('../modules/seances/seance-list/seance-list.component');
                this.currentComponent = SeanceListComponent;
                break;
            case 'payments':
                const { PaymentListComponent } = await import('../modules/payments/payment-list/payment-list.component');
                this.currentComponent = PaymentListComponent;
                break;
            case 'sales-stock':
                const { StockListComponent } = await import('../modules/sales-stock/stock-list/stock-list.component');
                this.currentComponent = StockListComponent;
                break;
            case 'expenses':
                const { ExpenseListComponent } = await import('../modules/expenses/expense-list/expense-list.component');
                this.currentComponent = ExpenseListComponent;
                break;
            case 'users':
                const { UserListComponent } = await import('../modules/users/user-list/user-list.component');
                this.currentComponent = UserListComponent;
                break;
            default:
                // Default to dashboard
                const { DashboardComponent: DefaultDashboard } = await import('../modules/dashboard/dashboard.component');
                this.currentComponent = DefaultDashboard;
                break;
        }
        this.cdr.detectChanges();
    }
}
