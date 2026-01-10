import  { Component,  OnInit  }  from '@angular/core';
import  {  MatDialog }  from  '@angular/material/dialog';
import {  UserService,  User  } from  '../user.service';
import  { UserFormComponent  }  from  '../user-form/user-form.component';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
   selector:  'app-user-list',
   templateUrl:  './user-list.component.html',
   styleUrls:  ['./user-list.component.scss'],
   standalone: true,
   imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule]
})
export class  UserListComponent  implements  OnInit {
    displayedColumns: string[]  =  ['username',  'email', 'role',  'enabled',  'actions'];
   users:  User[]  = [];

   constructor(private  userService:  UserService,  private dialog:  MatDialog)  {}

   ngOnInit():  void {
       this.loadUsers();
   }

   loadUsers():  void  {
       this.userService.getUsers().subscribe(data =>  this.users  =  data);
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
}
