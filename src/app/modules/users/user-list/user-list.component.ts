import  { Component,  OnInit  }  from '@angular/core';
import  {  MatDialog }  from  '@angular/material/dialog';
import {  UserService,  User  } from  '../user.service';
import  { UserFormComponent  }  from  '../user-form/user-form.component';
import { PasswordResetDialogComponent } from '../password-reset-dialog/password-reset-dialog.component';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
    selector:  'app-user-list',
    templateUrl:  './user-list.component.html',
    styleUrls: ['./user-list.component.scss'],
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, InputTextModule, IconFieldModule, InputIconModule, TagModule, MatButtonModule, MatIconModule, ConfirmDialogModule],
    providers: [ConfirmationService]
})
export class  UserListComponent  implements  OnInit {
   users:  User[]  = [];
   loading: boolean = true;

   constructor(private  userService:  UserService,  private dialog:  MatDialog, private confirmationService: ConfirmationService)  {}

   ngOnInit():  void {
       this.loadUsers();
   }

   loadUsers():  void  {
       this.userService.getUsers().subscribe(data => {
           this.users  =  data;
           this.loading = false;
       });
   }

   addUser():  void {
       const  dialogRef  = this.dialog.open(UserFormComponent,  {  width:  '400px' });
       dialogRef.afterClosed().subscribe(result  =>  {
          if  (result) this.loadUsers();
       });
   }

   editUser(user:  User):  void  {
      const  dialogRef  =  this.dialog.open(UserFormComponent, {  width:  '400px',  data: user  });
       dialogRef.afterClosed().subscribe(result  => {
           if (result)  this.loadUsers();
       });
   }

   deleteUser(id:  number):  void {
       this.userService.deleteUser(id).subscribe(()  =>  this.loadUsers());
   }

   resetPassword(user: User): void {
       const dialogRef = this.dialog.open(PasswordResetDialogComponent, {
           width: '400px',
       });

       dialogRef.afterClosed().subscribe(newPassword => {
           if (newPassword) {
               this.userService.resetPassword(user.id!, newPassword).subscribe(() => {
                   // You might want to show a success message here
                   this.loadUsers();
               });
           }
       });
   }

   clear(table: any): void {
       table.clear();
   }
}
