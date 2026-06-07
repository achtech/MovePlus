import  {  Injectable  } from  '@angular/core';
import { HttpClient } from  '@angular/common/http';
import {  Observable  } from  'rxjs';
import { environment } from '../../../environments/environment';

export interface  Expense  {
   id?:  number;
   description:  string;
   amount:  number;
   category:  string;
   expenseDate:  string;
   paidBy:  number;
   paidByName?: string;
   createdAt?: string;
   updatedAt?: string;
}

@Injectable({  providedIn:  'root' })
export  class  ExpenseService {
   private apiUrl = `${environment.apiUrl}/expenses`;

   constructor(private http: HttpClient)  {}

   getExpenses():  Observable<Expense[]>  {
      return this.http.get<Expense[]>(this.apiUrl);
   }

   addExpense(expense:  Expense):  Observable<Expense>  {
      return this.http.post<Expense>(this.apiUrl, expense);
   }

   updateExpense(id:  number,  expense: Expense):  Observable<Expense>  {
      return this.http.put<Expense>(`${this.apiUrl}/${id}`, expense);
   }

   deleteExpense(id:  number):  Observable<void>  {
      return this.http.delete<void>(`${this.apiUrl}/${id}`);
   }
}
