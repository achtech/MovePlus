import  {  Component,  OnInit }  from  '@angular/core';
import {  MatDialog  }  from '@angular/material/dialog';
import  {  SaleService, Sale  }  from  '../sale.service';
import  {  SaleFormComponent  } from  '../sale-form/sale-form.component';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
   selector:  'app-sale-list',
   templateUrl:  './sale-list.component.html',
   styleUrls:  ['./sale-list.component.scss'],
   standalone: true,
   imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule]
})
export  class  SaleListComponent implements  OnInit  {
   displayedColumns:  string[]  = ['productName',  'quantity',  'unitPrice',  'total', 'saleDate',  'actions'];
   sales:  Sale[]  =  [];

    constructor(private saleService:  SaleService,  private  dialog: MatDialog)  {}

   ngOnInit():  void  {
      this.loadSales();
    }

    loadSales(): void  {
       this.saleService.getSales().subscribe(data  => {
           this.sales =  data.map(s  =>  ({ ...s,  total:  s.quantity  * s.unitPrice  }));
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
}
