 import  {  Component, Inject  }  from  '@angular/core';
import  {  FormBuilder,  FormGroup, Validators  }  from  '@angular/forms';
import  {  MatDialogRef,  MAT_DIALOG_DATA, MatDialogModule }  from  '@angular/material/dialog';
 import {  ExpenseService,  Expense  } from  '../expense.service';
import { AuthService } from '../../../core/services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

 @Component({
    selector:  'app-expense-form',
    templateUrl:  './expense-form.component.html',
    styleUrls: ['./expense-form.component.scss'],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatDialogModule]
})
 export  class  ExpenseFormComponent {
     form: FormGroup;
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
        if  (this.form.valid) {
            const expense  =  {
               ...this.form.value,
               expenseDate: new Date().toISOString().split('T')[0],
               paidBy: this.authService.getCurrentUserId() || 1
            };
           if  (this.data?.id)  {
              this.expenseService.updateExpense(this.data.id, expense).subscribe({
                  next: () => this.dialogRef.close(true),
                  error: (err) => {
                      console.error('Error updating expense:', err);
                      alert('Erreur lors de la mise à jour de la charge');
                  }
              });
           }  else {
               this.expenseService.addExpense(expense).subscribe({
                   next: () => this.dialogRef.close(true),
                   error: (err) => {
                       console.error('Error adding expense:', err);
                       alert('Erreur lors de l\'ajout de la charge');
                   }
               });
           }
        }
    }
 
    cancel():  void {
        this.dialogRef.close(false);
    }
 }
