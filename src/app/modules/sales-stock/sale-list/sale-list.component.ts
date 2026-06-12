import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SaleService, Sale } from '../sale.service';
import { SaleFormComponent } from '../sale-form/sale-form.component';
import { StockService, Stock } from '../stock.service';
import { StockFormComponent } from '../stock-form/stock-form.component';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { CardComponent } from '../../../theme/shared/components/card/card.component';
import { TranslateModule } from '@ngx-translate/core';
import { AppCurrencyPipe } from '../../../core/pipes/app-currency.pipe';
import { Table } from 'primeng/table';
import { FORM_DIALOG_OPTIONS } from '../../../core/constants/dialog.config';
import { runAfterBrowserHydration } from '../../../core/utils/browser-init';

@Component({
   selector:  'app-sale-list',
   templateUrl:  './sale-list.component.html',
   styleUrls:  ['./sale-list.component.scss'],
   standalone: true,
   imports: [CommonModule, TableModule, ButtonModule, InputTextModule, IconFieldModule, InputIconModule, TagModule, CardComponent, TranslateModule, AppCurrencyPipe]
})
export  class  SaleListComponent {
   sales:  Sale[]  =  [];
   stock:  Stock[]  =  [];
   loading: boolean = true;
   showSales: boolean = true; // Default to sales view

   @ViewChild('dt1') dt1: Table | undefined;
   @ViewChild('dt2') dt2: Table | undefined;

    constructor(private saleService:  SaleService, private stockService: StockService, private  dialog: MatDialog)  {
      runAfterBrowserHydration(() => {
        this.loadSales();
        this.loadStock();
      });
    }

    loadSales(): void  {
       this.saleService.getSales().subscribe(data  => {
           this.sales =  data.map(s  =>  ({ ...s,  total:  s.quantity  * s.unitPrice  }));
           this.loading = false;
       });
   }

   addSale():  void  {
      const  dialogRef  =  this.dialog.open(SaleFormComponent, FORM_DIALOG_OPTIONS);
      dialogRef.afterClosed().subscribe(result  =>  {
          if  (result)  this.loadSales();
      });
    }

    editSale(sale: Sale):  void  {
       const dialogRef  =  this.dialog.open(SaleFormComponent,  { ...FORM_DIALOG_OPTIONS, data:  sale });
       dialogRef.afterClosed().subscribe(result  =>  {
          if  (result) this.loadSales();
       });
   }

   deleteSale(id:  number):  void  {
      this.saleService.deleteSale(id).subscribe(()  =>  this.loadSales());
   }

   loadStock(): void  {
      this.stockService.getStock().subscribe(data  =>  {
          this.stock  =  data;
      });
   }

   addStock():  void  {
      const  dialogRef  =  this.dialog.open(StockFormComponent, FORM_DIALOG_OPTIONS);
      dialogRef.afterClosed().subscribe(result  =>  {
          if  (result)  this.loadStock();
      });
   }

   editStock(stockItem: Stock):  void  {
      const dialogRef  =  this.dialog.open(StockFormComponent,  { ...FORM_DIALOG_OPTIONS, data:  stockItem });
      dialogRef.afterClosed().subscribe(result  =>  {
         if  (result) this.loadStock();
      });
   }

   deleteStock(id:  number):  void  {
      this.stockService.deleteStock(id).subscribe(()  =>  this.loadStock());
   }

   toggleView(): void {
       this.showSales = !this.showSales;
   }

   isLowStock(item:  Stock):  boolean  {
       return  item.quantity <=  item.minStockAlert;
   }

   clear(table: any): void {
       table.clear();
   }
}
