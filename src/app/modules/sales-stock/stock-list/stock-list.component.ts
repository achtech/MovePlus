import  {  Component,  OnInit  }  from  '@angular/core';
import  {  StockService,  Stock }  from  '../stock.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

@Component({
    selector:  'app-stock-list',
    templateUrl:  './stock-list.component.html',
    styleUrls:  ['./stock-list.component.scss'],
    standalone: true,
    imports: [CommonModule, MatTableModule]
})
export  class  StockListComponent  implements  OnInit {
    displayedColumns:  string[]  =  ['productName',  'quantity',  'unitPrice',  'minStockAlert',  'lastUpdated'];
    stock:  Stock[]  =  [];

    constructor(private  stockService:  StockService) {}

    ngOnInit():  void  {
        this.loadStock();
    }

    loadStock():  void  {
       this.stockService.getStock().subscribe(data  =>  this.stock  =  data);
    }

    isLowStock(item:  Stock):  boolean  {
        return  item.quantity <=  item.minStockAlert;
    }
}
