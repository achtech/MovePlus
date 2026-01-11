import  {  Component,  OnInit  }  from  '@angular/core';
import  {  MatDialog  }  from '@angular/material/dialog';
import  {  StockService,  Stock }  from  '../stock.service';
import  {  StockFormComponent  } from  '../stock-form/stock-form.component';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector:  'app-stock-list',
    templateUrl:  './stock-list.component.html',
    styleUrls:  ['./stock-list.component.scss'],
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, InputTextModule, IconFieldModule, InputIconModule, TagModule, MatButtonModule, MatIconModule]
})
export  class  StockListComponent  implements  OnInit {
    stock:  Stock[]  =  [];
    loading: boolean = true;

    constructor(private  stockService:  StockService, private  dialog: MatDialog) {}

    ngOnInit():  void  {
        this.loadStock();
    }

    loadStock():  void  {
       this.stockService.getStock().subscribe(data  =>  {
           this.stock  =  data;
           this.loading = false;
       });
    }

    addStock():  void  {
       const  dialogRef  =  this.dialog.open(StockFormComponent, {  width:  '400px'  });
       dialogRef.afterClosed().subscribe(result  =>  {
           if  (result)  this.loadStock();
       });
    }

    isLowStock(item:  Stock):  boolean  {
        return  item.quantity <=  item.minStockAlert;
    }

    clear(table: any): void {
        table.clear();
    }
}
