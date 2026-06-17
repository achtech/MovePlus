 import  {  Component, Inject, OnInit  }  from  '@angular/core';
import  {  FormBuilder,  FormGroup, Validators  }  from  '@angular/forms';
import  {  MatDialogRef,  MAT_DIALOG_DATA, MatDialogModule }  from  '@angular/material/dialog';
 import {  SaleService,  Sale  } from  '../sale.service';
import { Stock, StockService } from '../stock.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  getFormValidationMessage,
  getApiErrorMessage,
  isFieldInvalid,
  getFieldErrorMessage,
  FORM_SAVE_ERROR
} from '../../../core/utils/form-submit.utils';
import { AppCurrencyPipe } from '../../../core/pipes/app-currency.pipe';
 
 @Component({
    selector:  'app-sale-form',
    templateUrl:  './sale-form.component.html',
    styleUrls: ['./sale-form.component.scss'],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatDialogModule, AppCurrencyPipe]
})
 export  class  SaleFormComponent implements OnInit {
     form: FormGroup;
     submitError = '';

     fieldInvalid = (name: string) => isFieldInvalid(this.form, name);
     fieldError = (name: string, label: string) => getFieldErrorMessage(this.form, name, label);
     stockItems: Stock[] = [];
 
    constructor(
        private  fb:  FormBuilder,
       private  saleService:  SaleService,
       private stockService: StockService,
        private dialogRef:  MatDialogRef<SaleFormComponent>,
        @Inject(MAT_DIALOG_DATA)  public data:  Sale
    )  {
        this.form  = this.fb.group({
            productName: [data?.productName  ||  '',  Validators.required],
           quantity:  [data?.quantity ||  '',  Validators.required],
           unitPrice:  [data?.unitPrice  || '',  Validators.required],
           saleDate:  [this.toDateInput(data?.saleDate) || this.todayDateInput(), Validators.required],
           notes: [data?.notes || '']
        });
    }

    ngOnInit(): void {
      this.stockService.getStock().subscribe((items) => {
        this.stockItems = items;
      });
    }

    onProductSelected(productName: string): void {
      const item = this.stockItems.find((s) => s.productName === productName);
      if (item && !this.data?.id) {
        this.form.patchValue({ unitPrice: item.unitPrice });
      }
    }

    get totalCost(): number {
      const quantity = Number(this.form.get('quantity')?.value) || 0;
      const unitPrice = Number(this.form.get('unitPrice')?.value) || 0;
      return quantity * unitPrice;
    }

    private todayDateInput(): string {
      return new Date().toISOString().substring(0, 10);
    }

    private toDateInput(value?: string): string {
      if (!value) return '';
      return value.substring(0, 10);
    }
 
        save():  void  {
        this.submitError = '';
        const validationError = getFormValidationMessage(this.form, {
          productName: 'produit',
          quantity: 'quantité',
          unitPrice: 'prix unitaire',
          saleDate: 'date'
        });
        if (validationError) {
          this.submitError = validationError;
          return;
        }

        const sale = this.form.value;
        const request$ = this.data?.id
          ? this.saleService.updateSale(this.data.id, sale)
          : this.saleService.addSale(sale);

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
