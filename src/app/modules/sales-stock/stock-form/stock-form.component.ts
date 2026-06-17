import  {  Component, Inject  }  from  '@angular/core';
import  {  FormBuilder,  FormGroup, Validators  }  from  '@angular/forms';
import  {  MatDialogRef,  MAT_DIALOG_DATA, MatDialogModule }  from  '@angular/material/dialog';
 import {  StockService,  Stock  } from  '../stock.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  getFormValidationMessage,
  getApiErrorMessage,
  isFieldInvalid,
  getFieldErrorMessage,
  FORM_SAVE_ERROR
} from '../../../core/utils/form-submit.utils';

 @Component({
    selector:  'app-stock-form',
    templateUrl:  './stock-form.component.html',
    styleUrls: ['./stock-form.component.scss'],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatDialogModule]
})
 export  class  StockFormComponent {
     form: FormGroup;
     submitError = '';

     fieldInvalid = (name: string) => isFieldInvalid(this.form, name);
     fieldError = (name: string, label: string) => getFieldErrorMessage(this.form, name, label);

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
        this.submitError = '';
        const validationError = getFormValidationMessage(this.form, {
          productName: 'produit',
          quantity: 'quantité',
          unitPrice: 'prix unitaire',
          minStockAlert: 'seuil d\'alerte'
        });
        if (validationError) {
          this.submitError = validationError;
          return;
        }

        const stock = this.form.value;
        const request$ = this.data?.id
          ? this.stockService.updateStock(this.data.id, stock)
          : this.stockService.addStock(stock);

        request$.subscribe({
          next: () => this.dialogRef.close(true),
          error: (err) => {
            this.submitError = getApiErrorMessage(err, FORM_SAVE_ERROR);
          }
        });
    }

   cancel():  void  {
        this.dialogRef.close(false);
    }
}