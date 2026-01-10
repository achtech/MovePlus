import  { NgModule  }  from  '@angular/core';
import  {  RouterModule,  Routes }  from  '@angular/router';
import {  AuthGuard  }  from './core/guards/auth.guard';
import { LayoutComponent } from './layout/layout.component';

export const  routes:  Routes  =  [
    {
        path:  '',
        redirectTo:  'dashboard',
        pathMatch:  'full'
    },
    {
        path:  'dashboard',
        component:  LayoutComponent
    },
    {
        path:  'patients',
        component:  LayoutComponent
    },
    {
        path:  'seances',
        component:  LayoutComponent
    },
    {
        path:  'payments',
        component:  LayoutComponent
    },
    {
        path:  'sales-stock',
        component:  LayoutComponent
    },
    {
        path:  'expenses',
        component:  LayoutComponent
    },
    {
        path:  'users',
        component:  LayoutComponent
    },
    {  path:  'login',  loadChildren:  ()  =>  import('./modules/auth/auth.module').then(m  =>  m.AuthModule)  },
    {  path:  '**',  redirectTo:  'dashboard'  }
];

@NgModule({
   imports:  [RouterModule.forRoot(routes)],
   exports:  [RouterModule]
})
export  class  AppRoutingModule {}
