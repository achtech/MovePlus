import  {  Injectable  } from  '@angular/core';
import {  Observable, of  } from  'rxjs';

export interface  Expense  {
   id?:  number;
   description:  string;
   amount:  number;
   category:  string;
   date:  string;
   paidBy:  number;
}

@Injectable({  providedIn:  'root' })
export  class  ExpenseService {
    private expenses: Expense[] = [
        { id: 1, description: 'Office Rent', amount: 1000, category: 'RENT', date: '2026-01-01', paidBy: 1 },
        { id: 2, description: 'Massage Supplies', amount: 200, category: 'SUPPLIES', date: '2026-01-05', paidBy: 2 },
        { id: 3, description: 'Assistant Salary', amount: 1500, category: 'SALARY', date: '2026-01-10', paidBy: 1 }
    ];

   constructor()  {}

   getExpenses():  Observable<Expense[]>  {
      return  of(this.expenses);
   }

   addExpense(expense:  Expense):  Observable<Expense>  {
      expense.id = this.expenses.length + 1;
      this.expenses.push(expense);
      return  of(expense);
   }

   updateExpense(id:  number,  expense: Expense):  Observable<Expense>  {
       const index = this.expenses.findIndex(e => e.id === id);
       if (index !== -1) {
           this.expenses[index] = { ...expense, id };
           return of(this.expenses[index]);
       }
       return of(null as any);
   }

   deleteExpense(id:  number):  Observable<void>  {
      this.expenses = this.expenses.filter(e => e.id !== id);
      return  of(void 0);
   }
}
