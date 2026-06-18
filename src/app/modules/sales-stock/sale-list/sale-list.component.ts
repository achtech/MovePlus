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
import { BrowserHydrationService } from '../../../core/utils/browser-init';
import { DeleteConfirmService } from '../../../core/services/delete-confirm.service';
import { DialogRefreshService } from '../../../core/services/dialog-refresh.service';
import { ExcelFileService } from '../../../core/services/excel-file.service';
import { formatImportResultMessage } from '../../../core/utils/excel-import.utils';
import { environment } from '../../../../environments/environment';

@Component({
   selector:  'app-sale-list',
   templateUrl:  './sale-list.component.html',
   styleUrls: ['./sale-list.component.scss'],
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

    constructor(private saleService: SaleService, private stockService: StockService, private dialog: MatDialog, private browserHydration: BrowserHydrationService, private deleteConfirm: DeleteConfirmService, private dialogRefresh: DialogRefreshService, private excelFile: ExcelFileService) {
      this.browserHydration.run(() => {
        this.loadSales();
        this.loadStock();
      });
    }

    loadSales(): void  {
       this.loading = true;
       this.saleService.getSales().subscribe(data  => {
           this.sales =  data.map(s  =>  ({ ...s,  total:  s.quantity  * s.unitPrice  }));
           this.loading = false;
       });
   }

   addSale():  void  {
      this.dialogRefresh.onSave(
        this.dialog.open(SaleFormComponent, FORM_DIALOG_OPTIONS),
        () => {
          this.loadSales();
          this.loadStock();
        }
      );
    }

    editSale(sale: Sale):  void  {
       this.dialogRefresh.onSave(
         this.dialog.open(SaleFormComponent, { ...FORM_DIALOG_OPTIONS, data: sale }),
         () => {
           this.loadSales();
           this.loadStock();
         }
       );
   }

   deleteSale(id:  number):  void  {
      this.deleteConfirm.confirmAndDelete(
        () => this.saleService.deleteSale(id),
        () => {
          this.loadSales();
          this.loadStock();
        }
      );
   }

   loadStock(): void  {
      this.stockService.getStock().subscribe(data  =>  {
          this.stock  =  [...data];
      });
   }

   addStock():  void  {
      this.dialogRefresh.onSave(
        this.dialog.open(StockFormComponent, FORM_DIALOG_OPTIONS),
        () => this.loadStock()
      );
   }

   editStock(stockItem: Stock):  void  {
      this.dialogRefresh.onSave(
        this.dialog.open(StockFormComponent, { ...FORM_DIALOG_OPTIONS, data: stockItem }),
        () => this.loadStock()
      );
   }

   deleteStock(id:  number):  void  {
      this.deleteConfirm.confirmAndDelete(
        () => this.stockService.deleteStock(id),
        () => this.loadStock()
      );
   }

   toggleView(): void {
       this.showSales = !this.showSales;
   }

   isLowStock(item:  Stock):  boolean  {
       return  item.quantity <=  item.minStockAlert;
   }

   saleTotal(sale: Sale): number {
       return sale.total ?? Number(sale.quantity) * Number(sale.unitPrice);
   }

   clear(table: any): void {
       table.clear();
   }

   downloadStockTemplate(): void {
     this.excelFile.download(`${environment.apiUrl}/excel/stock/template`, 'stock_template.xlsx').subscribe();
   }

   exportStockData(): void {
     this.excelFile.download(`${environment.apiUrl}/excel/stock/export`, 'stock_export.xlsx').subscribe();
   }

   importStockData(event: Event): void {
     const input = event.target as HTMLInputElement;
     const file = input.files?.[0];
     input.value = '';
     if (!file) {
       return;
     }
     this.excelFile.import(`${environment.apiUrl}/excel/stock/import`, file).subscribe({
       next: (result) => {
         alert(formatImportResultMessage(result));
         this.loadStock();
       },
       error: () => alert('Import impossible. Vérifiez le fichier Excel.')
     });
   }
}
