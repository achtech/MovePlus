import {  NgModule  }  from '@angular/core';
import  {  CommonModule }  from  '@angular/common';
import {  ExpensesRoutingModule  }  from './expenses-routing.module';
import  {  ExpenseListComponent }  from  './expense-list/expense-list.component';
import {  ExpenseFormComponent  }  from './expense-form/expense-form.component';

import  { FormsModule,  ReactiveFormsModule  }  from '@angular/forms';
import  {  MatTableModule }  from  '@angular/material/table';
import {  MatFormFieldModule  }  from '@angular/material/form-field';
import  {  MatInputModule }  from  '@angular/material/input';
import {  MatButtonModule  }  from '@angular/material/button';
import  {  MatIconModule }  from  '@angular/material/icon';
import {  MatDialogModule  }  from '@angular/material/dialog';
import  {  MatSelectModule }  from  '@angular/material/select';
import {  MatDatepickerModule  }  from '@angular/material/datepicker';
import  {  MatNativeDateModule }  from  '@angular/material/core';

@NgModule({
   declarations:  [],
    imports: [
       CommonModule,
       ExpensesRoutingModule,
       FormsModule,
      ReactiveFormsModule,
       MatTableModule,
       MatFormFieldModule,
       MatInputModule,
      MatButtonModule,
       MatIconModule,
       MatDialogModule,
       MatSelectModule,
      MatDatepickerModule,
       MatNativeDateModule,
       ExpenseListComponent,
       ExpenseFormComponent
   ]
})
export class  ExpensesModule  {}
