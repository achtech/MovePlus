 import  {  NgModule }  from  '@angular/core';
 import {  CommonModule  }  from '@angular/common';
 import  {  UsersRoutingModule }  from  './users-routing.module';
 import {  UserListComponent  }  from './user-list/user-list.component';
 import  {  UserFormComponent }  from  './user-form/user-form.component';
 
import  {  FormsModule,  ReactiveFormsModule }  from  '@angular/forms';
 import {  MatTableModule  }  from '@angular/material/table';
 import  {  MatFormFieldModule }  from  '@angular/material/form-field';
 import {  MatInputModule  }  from '@angular/material/input';
 import  {  MatButtonModule }  from  '@angular/material/button';
 import {  MatIconModule  }  from '@angular/material/icon';
 import  {  MatDialogModule }  from  '@angular/material/dialog';
 import {  MatSelectModule  }  from '@angular/material/select';
 
 @NgModule({
    declarations:  [],
    imports:  [
       CommonModule,
        UsersRoutingModule,
        FormsModule,
        ReactiveFormsModule,
       MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
       MatIconModule,
        MatDialogModule,
        MatSelectModule,
        UserListComponent,
        UserFormComponent
    ]
 })
 export class  UsersModule  {}
