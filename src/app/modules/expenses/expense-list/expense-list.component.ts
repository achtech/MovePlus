import  { Component, ChangeDetectorRef  }  from '@angular/core';
import  {  MatDialog }  from  '@angular/material/dialog';
import {  ExpenseService,  Expense  } from  '../expense.service';
import  { ExpenseFormComponent  }  from  '../expense-form/expense-form.component';
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
import { FORM_DIALOG_OPTIONS } from '../../../core/constants/dialog.config';
import { runAfterBrowserHydration } from '../../../core/utils/browser-init';

@Component({
    selector: 'app-expense-list',
    templateUrl: './expense-list.component.html',
    styleUrls: ['./expense-list.component.scss'],
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, InputTextModule, IconFieldModule, InputIconModule, TagModule, CardComponent, TranslateModule, AppCurrencyPipe]
})
export  class ExpenseListComponent  {
   expenses:  Expense[]  =  [];
   loading: boolean = true;

    constructor(
        private expenseService: ExpenseService,
        private dialog: MatDialog,
        private cdr: ChangeDetectorRef
    ) {
      runAfterBrowserHydration(() => this.loadExpenses());
    }

    loadExpenses(): void  {
       this.loading = true;
       this.expenseService.getExpenses().subscribe({
           next: (data) => {
               this.expenses = data;
               this.loading = false;
               this.cdr.markForCheck();
           },
           error: (error) => {
               console.error('Error loading expenses:', error);
               this.loading = false;
               this.cdr.markForCheck();
           }
       });
   }

   addExpense():  void  {
       const dialogRef  =  this.dialog.open(ExpenseFormComponent, FORM_DIALOG_OPTIONS);
       dialogRef.afterClosed().subscribe(result =>  {
          if  (result)  {
              this.loadExpenses();
          }
       });
   }

   editExpense(expense:  Expense): void  {
       const  dialogRef =  this.dialog.open(ExpenseFormComponent,  { ...FORM_DIALOG_OPTIONS, data:  expense  });
      dialogRef.afterClosed().subscribe(result  =>  {
          if  (result)  {
              this.loadExpenses();
          }
      });
    }

    deleteExpense(id: number):  void  {
       if (confirm('Êtes-vous sûr de vouloir supprimer cette charge?')) {
           this.expenseService.deleteExpense(id).subscribe({
               next: () => {
                   this.loadExpenses();
               },
               error: (error) => console.error('Error deleting expense:', error)
           });
       }
   }
}
