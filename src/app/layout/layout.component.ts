import  { Component,  OnInit  , OnDestroy,  AfterViewInit, ChangeDetectorRef  }  from '@angular/core';
import  {  Router,  NavigationEnd }  from  '@angular/router';
import {  CommonModule  }  from '@angular/common';
import  {  MatToolbarModule }  from '@angular/material/toolbar';
import {  MatSidenavModule  }  from '@angular/material/sidenav';
import  {  MatListModule }  from '@angular/material/list';
import {  MatIconModule  }  from '@angular/material/icon';
import  {  MatButtonModule }  from '@angular/material/button';
import {  filter  }  from 'rxjs/operators';
import  {  Subscription }  from  'rxjs';
import {  BreakpointObserver,  Breakpoints  } from  '@angular/cdk/layout';
import { AuthService } from '../core/services/auth.service';

@Component({
   selector:  'app-layout',
   templateUrl:  './layout.component.html',
   styleUrls:  ['./layout.component.scss'],
   standalone:  true,
   imports:  [
      CommonModule,
       MatToolbarModule,
       MatSidenavModule,
       MatListModule,
      MatIconModule,
       MatButtonModule
   ]
})
export  class LayoutComponent  implements  OnInit,  AfterViewInit, OnDestroy  {
   isSidebarOpen  =  true;
   isMobile  =  false;
   currentComponent:  any =  null;
   pageTitle: string = 'Move + Clinic';
   private  routerSubscription:  Subscription  | null  =  null;

   constructor(
       private router:  Router,
       private  cdr: ChangeDetectorRef,
       private  breakpointObserver:  BreakpointObserver,
       private authService: AuthService
   )  {}
     logout(): void {
         this.authService.logout();
         this.router.navigate(['/login']);
     }

    ngOnInit(): void  {
       //  Observe screen  size  changes  for responsive  sidebar
       this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result  => {
           this.isMobile =  result.matches;
          this.isSidebarOpen  =  !this.isMobile;  // close  sidebar  on  mobile by  default
          setTimeout(() => this.cdr.detectChanges());
       });

       // Subscribe  to  router  events for  dynamic  component  loading
      this.routerSubscription  =  this.router.events
          .pipe(filter(event  =>  event instanceof  NavigationEnd))
          .subscribe((event:  NavigationEnd)  =>  {
             this.loadComponentForRoute(event.urlAfterRedirects);
           });
   }

   ngAfterViewInit():  void {
       //  Load  initial component
       this.loadComponentForRoute(this.router.url);
   }

   ngOnDestroy():  void  {
       if (this.routerSubscription)  {
          this.routerSubscription.unsubscribe();
       }
   }

   toggleSidebar():  void  {
       this.isSidebarOpen =  !this.isSidebarOpen;
   }

   navigateTo(path:  string):  void  {
      this.router.navigate([path]);
    }

    private async  loadComponentForRoute(url:  string):  Promise<void> {
       const  path  = url.split('/')[1]  ||  'dashboard';

       switch  (path)  {
          case  'dashboard':
              setTimeout(() => this.pageTitle = 'Dashboard');
              const {  DashboardComponent  }  = await  import('../modules/dashboard/dashboard.component');
              this.currentComponent  = DashboardComponent;
              break;
          case  'packs':
              setTimeout(() => this.pageTitle = 'Pack');
              const  { PackManagement  }  =  await import('../modules/pack-management/pack-management');
              this.currentComponent  =  PackManagement;
             break;
          case  'patients':
              setTimeout(() => this.pageTitle = 'Patients');
              const  { PatientListComponent  }  =  await import('../modules/patients/patient-list/patient-list.component');
              this.currentComponent  =  PatientListComponent;
             break;
           case 'seances':
              setTimeout(() => this.pageTitle = 'Séances');
              const  {  SeanceListComponent }  =  await  import('../modules/seances/seance-list/seance-list.component');
             this.currentComponent  =  SeanceListComponent;
              break;
          case  'payments':
              setTimeout(() => this.pageTitle = 'Paiements');
             const  {  PaymentListComponent  } =  await  import('../modules/payments/payment-list/payment-list.component');
              this.currentComponent =  PaymentListComponent;
              break;
          case  'sales-stock':
              setTimeout(() => this.pageTitle = 'Ventes & Stock');
              const {  SaleListComponent  }  = await  import('../modules/sales-stock/sale-list/sale-list.component');
              this.currentComponent  = SaleListComponent;
              break;
          case  'expenses':
              setTimeout(() => this.pageTitle = 'Charges');
              const  { ExpenseListComponent  }  =  await  import('../modules/expenses/expense-list/expense-list.component');
              this.currentComponent  =  ExpenseListComponent;
             break;
           case 'users':
              setTimeout(() => this.pageTitle = 'Utilisateurs');
              const  {  UserListComponent }  =  await  import('../modules/users/user-list/user-list.component');
             this.currentComponent  =  UserListComponent;
              break;
          default:
              setTimeout(() => this.pageTitle = 'Move + Clinic');
              const {  DashboardComponent:  DefaultDashboard  } =  await  import('../modules/dashboard/dashboard.component');
              this.currentComponent =  DefaultDashboard;
              break;
       }
      setTimeout(() => this.cdr.detectChanges());
    }
}
