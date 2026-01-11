import  { NgModule  }  from  '@angular/core';
import  {  RouterModule,  Routes }  from  '@angular/router';
import {  SaleListComponent  }  from './sale-list/sale-list.component';
import  {  StockListComponent }  from  './stock-list/stock-list.component';
import { StockFormComponent } from './stock-form/stock-form.component';

const  routes:  Routes  = [
    { path:  '',  component:  SaleListComponent },
    { path:  'stock',  component:  StockListComponent },
    { path:  'stock-form',  component:  StockFormComponent }
];

@NgModule({
   imports:  [RouterModule.forChild(routes)],
   exports:  [RouterModule]
})
export  class  SalesStockRoutingModule {}
