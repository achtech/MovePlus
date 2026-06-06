import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';

export const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./modules/dashboard/dashboard.module').then((m) => m.DashboardModule)
      },
      {
        path: 'packs',
        loadComponent: () =>
          import('./modules/pack-management/pack-management').then((m) => m.PackManagement)
      },
      {
        path: 'patients',
        loadChildren: () => import('./modules/patients/patients.module').then((m) => m.PatientsModule)
      },
      {
        path: 'seances',
        loadChildren: () => import('./modules/seances/seances.module').then((m) => m.SeancesModule)
      },
      {
        path: 'payments',
        loadChildren: () => import('./modules/payments/payments.module').then((m) => m.PaymentsModule)
      },
      {
        path: 'sales-stock',
        loadChildren: () =>
          import('./modules/sales-stock/sales-stock.module').then((m) => m.SalesStockModule)
      },
      {
        path: 'expenses',
        loadChildren: () => import('./modules/expenses/expenses.module').then((m) => m.ExpensesModule)
      },
      {
        path: 'users',
        loadChildren: () => import('./modules/users/users.module').then((m) => m.UsersModule)
      }
    ]
  },
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: 'login',
        loadChildren: () => import('./modules/auth/auth.module').then((m) => m.AuthModule)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
