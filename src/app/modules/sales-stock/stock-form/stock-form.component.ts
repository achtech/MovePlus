import  {  Component, Inject  }  from  '@angular/core';
import  {  FormBuilder,  FormGroup, Validators  }  from  '@angular/forms';
import  {  MatDialogRef,  MAT_DIALOG_DATA, MatDialogModule }  from  '@angular/material/dialog';
 import {  StockService,  Stock  } from  '../stock.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

 @Component({
    selector:  'app-stock-form',
    templateUrl:  './stock-form.component.html',
    styleUrls: ['./stock-form.component.scss'],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatDialogModule]
})
 export  class  StockFormComponent {
     form: FormGroup;

    constructor(
        private  fb:  FormBuilder,
       private  stockService:  StockService,
        private dialogRef:  MatDialogRef<StockFormComponent>,
        @Inject(MAT_DIALOG_DATA)  public data:  Stock
    )  {
        this.form  = this.fb.group({
            productName: [data?.productName  ||  '',  Validators.required],
           quantity:  [data?.quantity ||  '',  Validators.required],
           unitPrice:  [data?.unitPrice  || '',  Validators.required],
           minStockAlert:  [data?.minStockAlert  ||  '', Validators.required]
        });
    }

        save():  void  {
        if (this.form.valid)  {
            const  stock  =  this.form.value;
            if  (this.data?.id)  {
               this.stockService.updateStock(this.data.id,  stock).subscribe(()  =>  this.dialogRef.close(true));
            }  else  {
               this.stockService.addStock(stock).subscribe(()  =>  this.dialogRef.close(true));
            }
        }
    }

   cancel():  void  {
        this.dialogRef.close(false);
    }
}