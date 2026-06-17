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
import { BrowserHydrationService } from '../../../core/utils/browser-init';
import { DeleteConfirmService } from '../../../core/services/delete-confirm.service';
import { DialogRefreshService } from '../../../core/services/dialog-refresh.service';

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
        private cdr: ChangeDetectorRef,
        private browserHydration: BrowserHydrationService,
        private deleteConfirm: DeleteConfirmService,
        private dialogRefresh: DialogRefreshService
    ) {
      this.browserHydration.run(() => this.loadExpenses());
    }

    loadExpenses(): void  {
       this.loading = true;
       this.expenseService.getExpenses().subscribe({
           next: (data) => {
               this.expenses = [...data];
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
       this.dialogRefresh.onSave(
         this.dialog.open(ExpenseFormComponent, FORM_DIALOG_OPTIONS),
         () => this.loadExpenses()
       );
   }

   editExpense(expense:  Expense): void  {
       this.dialogRefresh.onSave(
         this.dialog.open(ExpenseFormComponent, { ...FORM_DIALOG_OPTIONS, data: expense }),
         () => this.loadExpenses()
       );
    }

    deleteExpense(id: number):  void  {
       this.deleteConfirm.confirmAndDelete(
         () => this.expenseService.deleteExpense(id),
         () => this.loadExpenses()
       );
   }
}
