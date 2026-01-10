 import  {  Component, Inject  }  from  '@angular/core';
import  {  FormBuilder,  FormGroup, Validators  }  from  '@angular/forms';
import  {  MatDialogRef,  MAT_DIALOG_DATA, MatDialogModule }  from  '@angular/material/dialog';
 import {  ExpenseService,  Expense  } from  '../expense.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
 
 @Component({
    selector:  'app-expense-form',
    templateUrl:  './expense-form.component.html',
    styleUrls: ['./expense-form.component.scss'],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatDialogModule]
})
 export  class  ExpenseFormComponent {
     form: FormGroup;
     categories =  ['RENT',  'SUPPLIES',  'SALARY', 'OTHER'];
 
    constructor(
        private  fb:  FormBuilder,
       private  expenseService:  ExpenseService,
        private dialogRef:  MatDialogRef<ExpenseFormComponent>,
        @Inject(MAT_DIALOG_DATA)  public data:  Expense
    )  {
        this.form  = this.fb.group({
            description: [data?.description  ||  '',  Validators.required],
           amount:  [data?.amount ||  '',  Validators.required],
           category:  [data?.category  || '',  Validators.required],
           date:  [data?.date  ||  '', Validators.required],
            paidBy: [data?.paidBy  ||  '',  Validators.required]
       });
     }

     save(): void  {
        if  (this.form.valid) {
            const expense  =  this.form.value;
           if  (this.data?.id)  {
              this.expenseService.updateExpense(this.data.id,  expense).subscribe(()  =>  this.dialogRef.close(true));
           }  else {
               this.expenseService.addExpense(expense).subscribe(()  =>  this.dialogRef.close(true));
           }
        }
    }
 
    cancel():  void {
        this.dialogRef.close(false);
    }
 }
