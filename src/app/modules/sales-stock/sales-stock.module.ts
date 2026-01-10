import  {  NgModule  } from  '@angular/core';
import  { CommonModule  }  from  '@angular/common';
import  {  SalesStockRoutingModule  } from  './sales-stock-routing.module';
import  { SaleListComponent  }  from  './sale-list/sale-list.component';
import  {  SaleFormComponent  } from  './sale-form/sale-form.component';
import  { StockListComponent  }  from  './stock-list/stock-list.component';

import  {  FormsModule, ReactiveFormsModule  }  from  '@angular/forms';
import  {  MatTableModule  } from  '@angular/material/table';
import  { MatFormFieldModule  }  from  '@angular/material/form-field';
import  {  MatInputModule  } from  '@angular/material/input';
import  { MatButtonModule  }  from  '@angular/material/button';
import  {  MatIconModule  } from  '@angular/material/icon';
import  { MatDialogModule  }  from  '@angular/material/dialog';

@NgModule({
   declarations:  [],
   imports:  [
      CommonModule,
       SalesStockRoutingModule,
       FormsModule,
       ReactiveFormsModule,
      MatTableModule,
       MatFormFieldModule,
       MatInputModule,
       MatButtonModule,
      MatIconModule,
       MatDialogModule,
       SaleListComponent,
       SaleFormComponent,
       StockListComponent
   ]
})
export  class SalesStockModule  {}
