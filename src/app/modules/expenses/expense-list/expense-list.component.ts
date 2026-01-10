import  { Component,  OnInit  }  from '@angular/core';
import  {  MatDialog }  from  '@angular/material/dialog';
import {  ExpenseService,  Expense  } from  '../expense.service';
import  { ExpenseFormComponent  }  from  '../expense-form/expense-form.component';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-expense-list',
    templateUrl: './expense-list.component.html',
    styleUrls: ['./expense-list.component.scss'],
    standalone: true,
    imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule]
})
export  class ExpenseListComponent  implements  OnInit  {
   displayedColumns:  string[] =  ['description',  'amount',  'category', 'date',  'actions'];
   expenses:  Expense[]  =  [];

    constructor(private expenseService:  ExpenseService,  private  dialog: MatDialog)  {}

   ngOnInit():  void  {
      this.loadExpenses();
    }

    loadExpenses(): void  {
       this.expenseService.getExpenses().subscribe(data  => {
           this.expenses =  data;
       });
   }

   addExpense():  void  {
       const dialogRef  =  this.dialog.open(ExpenseFormComponent,  { width:  '400px'  });
       dialogRef.afterClosed().subscribe(result =>  {
          if  (result)  this.loadExpenses();
       });
   }

   editExpense(expense:  Expense): void  {
       const  dialogRef =  this.dialog.open(ExpenseFormComponent,  {  width: '400px',  data:  expense  });
      dialogRef.afterClosed().subscribe(result  =>  {
          if  (result)  this.loadExpenses();
      });
    }

    deleteExpense(id: number):  void  {
       this.expenseService.deleteExpense(id).subscribe(() =>  this.loadExpenses());
   }
}
