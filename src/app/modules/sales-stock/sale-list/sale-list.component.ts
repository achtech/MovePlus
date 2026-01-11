import { Component, OnInit, ViewChild } from '@angular/core';
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
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Table } from 'primeng/table';

@Component({
   selector:  'app-sale-list',
   templateUrl:  './sale-list.component.html',
   styleUrls:  ['./sale-list.component.scss'],
   standalone: true,
   imports: [CommonModule, TableModule, ButtonModule, InputTextModule, IconFieldModule, InputIconModule, TagModule, MatButtonModule, MatIconModule]
})
export  class  SaleListComponent implements  OnInit  {
   sales:  Sale[]  =  [];
   stock:  Stock[]  =  [];
   loading: boolean = true;
   showSales: boolean = true; // Default to sales view

   @ViewChild('dt1') dt1: Table | undefined;
   @ViewChild('dt2') dt2: Table | undefined;

    constructor(private saleService:  SaleService, private stockService: StockService, private  dialog: MatDialog)  {}

   ngOnInit():  void  {
      this.loadSales();
      this.loadStock();
    }

    loadSales(): void  {
       this.saleService.getSales().subscribe(data  => {
           this.sales =  data.map(s  =>  ({ ...s,  total:  s.quantity  * s.unitPrice  }));
           this.loading = false;
       });
   }

   addSale():  void  {
      const  dialogRef  =  this.dialog.open(SaleFormComponent, {  width:  '400px'  });
      dialogRef.afterClosed().subscribe(result  =>  {
          if  (result)  this.loadSales();
      });
    }

    editSale(sale: Sale):  void  {
       const dialogRef  =  this.dialog.open(SaleFormComponent,  { width:  '400px',  data:  sale });
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
      const  dialogRef  =  this.dialog.open(StockFormComponent, {  width:  '400px'  });
      dialogRef.afterClosed().subscribe(result  =>  {
          if  (result)  this.loadStock();
      });
   }

   editStock(stockItem: Stock):  void  {
      const dialogRef  =  this.dialog.open(StockFormComponent,  { width:  '400px',  data:  stockItem });
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
