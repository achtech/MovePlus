 import  {  Component, Inject  }  from  '@angular/core';
import  {  FormBuilder,  FormGroup, Validators  }  from  '@angular/forms';
import  {  MatDialogRef,  MAT_DIALOG_DATA, MatDialogModule }  from  '@angular/material/dialog';
 import {  SaleService,  Sale  } from  '../sale.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
 
 @Component({
    selector:  'app-sale-form',
    templateUrl:  './sale-form.component.html',
    styleUrls: ['./sale-form.component.scss'],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatDialogModule]
})
 export  class  SaleFormComponent {
     form: FormGroup;
 
    constructor(
        private  fb:  FormBuilder,
       private  saleService:  SaleService,
        private dialogRef:  MatDialogRef<SaleFormComponent>,
        @Inject(MAT_DIALOG_DATA)  public data:  Sale
    )  {
        this.form  = this.fb.group({
            productName: [data?.productName  ||  '',  Validators.required],
           quantity:  [data?.quantity ||  '',  Validators.required],
           unitPrice:  [data?.unitPrice  || '',  Validators.required],
           saleDate:  [this.toDateInput(data?.saleDate), Validators.required],
           notes: [data?.notes || '']
        });
    }

    private toDateInput(value?: string): string {
      if (!value) return '';
      return value.substring(0, 10);
    }
 
        save():  void  {
        if (this.form.valid)  {
            const  sale  =  this.form.value;
            if  (this.data?.id)  {
               this.saleService.updateSale(this.data.id,  sale).subscribe(()  =>  this.dialogRef.close(true));
            }  else  {
               this.saleService.addSale(sale).subscribe(()  =>  this.dialogRef.close(true));
            }
        }
    }

   cancel():  void  {
        this.dialogRef.close(false);
    }
}
