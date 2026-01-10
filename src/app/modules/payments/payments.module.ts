import {  NgModule  }  from '@angular/core';
import  {  CommonModule }  from  '@angular/common';
import {  PaymentsRoutingModule  }  from './payments-routing.module';
import  {  PaymentListComponent }  from  './payment-list/payment-list.component';
import {  PaymentFormComponent  }  from './payment-form/payment-form.component';

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
    declarations: [],
   imports:  [
       CommonModule,
       PaymentsRoutingModule,
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
       PaymentListComponent,
       PaymentFormComponent
   ]
})
export class  PaymentsModule  {}
