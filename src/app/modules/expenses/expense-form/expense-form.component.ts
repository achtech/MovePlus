 import  {  Component, Inject  }  from  '@angular/core';
import  {  FormBuilder,  FormGroup, Validators  }  from  '@angular/forms';
import  {  MatDialogRef,  MAT_DIALOG_DATA, MatDialogModule }  from  '@angular/material/dialog';
 import {  ExpenseService,  Expense  } from  '../expense.service';
import { AuthService } from '../../../core/services/auth.service';
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
    selector:  'app-expense-form',
    templateUrl:  './expense-form.component.html',
    styleUrls: ['./expense-form.component.scss'],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatDialogModule]
})
 export  class  ExpenseFormComponent {
     form: FormGroup;
     submitError = '';

     fieldInvalid = (name: string) => isFieldInvalid(this.form, name);
     fieldError = (name: string, label: string) => getFieldErrorMessage(this.form, name, label);
     categories =  ['RENT',  'SUPPLIES',  'SALARY', 'OTHER'];
 
    constructor(
        private  fb:  FormBuilder,
       private  expenseService:  ExpenseService,
        private authService: AuthService,
        private dialogRef:  MatDialogRef<ExpenseFormComponent>,
        @Inject(MAT_DIALOG_DATA)  public data:  Expense
    )  {
        this.form  = this.fb.group({
            description: [data?.description  ||  '',  Validators.required],
           amount:  [data?.amount ||  '',  Validators.required],
           category:  [data?.category  || '',  Validators.required]
       });
     }

     save(): void  {
        this.submitError = '';
        const validationError = getFormValidationMessage(this.form, {
          description: 'description',
          amount: 'montant',
          category: 'catégorie'
        });
        if (validationError) {
          this.submitError = validationError;
          return;
        }

        const expense  =  {
           ...this.form.value,
           expenseDate: new Date().toISOString().split('T')[0],
           paidBy: this.authService.getCurrentUserId() || 1
        };

        const request$ = this.data?.id
          ? this.expenseService.updateExpense(this.data.id, expense)
          : this.expenseService.addExpense(expense);

        request$.subscribe({
          next: () => this.dialogRef.close(true),
          error: (err) => {
            this.submitError = getApiErrorMessage(err, FORM_SAVE_ERROR);
          }
        });
    }
 
    cancel():  void {
        this.dialogRef.close(false);
    }
 }
