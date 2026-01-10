 import  {  NgModule  } from  '@angular/core';
 import  {  CommonModule }  from  '@angular/common';
 import  { DashboardRoutingModule  }  from  './dashboard-routing.module';
 import {  DashboardComponent  }  from  './dashboard.component';

 import  {  MatCardModule  } from  '@angular/material/card';
 import  {  MatGridListModule }  from  '@angular/material/grid-list';
 import  { MatIconModule  }  from  '@angular/material/icon';
 import {  MatToolbarModule  }  from  '@angular/material/toolbar';
import  {  MatSidenavModule  }  from '@angular/material/sidenav';
 import  {  MatListModule  } from  '@angular/material/list';
 
 @NgModule({
    declarations:  [],
    imports:  [
        CommonModule,
        DashboardRoutingModule,
        MatCardModule,
        MatGridListModule,
        MatIconModule,
        MatToolbarModule,
        MatSidenavModule,
        MatListModule,
        DashboardComponent
     ]
})
 export  class  DashboardModule  {}
