import  { Component  }  from '@angular/core';
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
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { CardComponent } from '../../../theme/shared/components/card/card.component';
import { TranslateModule } from '@ngx-translate/core';
import { FORM_DIALOG_OPTIONS } from '../../../core/constants/dialog.config';
import { runAfterBrowserHydration } from '../../../core/utils/browser-init';
import { avatarImagePath, userDisplayName } from '../../../core/constants/avatars';

@Component({
    selector:  'app-user-list',
    templateUrl:  './user-list.component.html',
    styleUrls: ['./user-list.component.scss'],
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, InputTextModule, IconFieldModule, InputIconModule, TagModule, ConfirmDialogModule, TooltipModule, CardComponent, TranslateModule],
    providers: [ConfirmationService]
})
export class  UserListComponent {
   users:  User[]  = [];
   loading: boolean = true;
   readonly avatarImagePath = avatarImagePath;
   readonly userDisplayName = userDisplayName;

   constructor(private  userService:  UserService,  private dialog:  MatDialog, private confirmationService: ConfirmationService)  {
       runAfterBrowserHydration(() => this.loadUsers());
   }

   loadUsers():  void  {
       this.userService.getUsers().subscribe(data => {
           this.users  =  data;
           this.loading = false;
       });
   }

   addUser():  void {
       const  dialogRef  = this.dialog.open(UserFormComponent,  FORM_DIALOG_OPTIONS);
       dialogRef.afterClosed().subscribe(result  =>  {
          if  (result) this.loadUsers();
       });
   }

   editUser(user:  User):  void  {
      const  dialogRef  =  this.dialog.open(UserFormComponent, { ...FORM_DIALOG_OPTIONS, data: user  });
       dialogRef.afterClosed().subscribe(result  => {
           if (result)  this.loadUsers();
       });
   }

   deleteUser(id:  number):  void {
       this.userService.deleteUser(id).subscribe(()  =>  this.loadUsers());
   }

   resetPassword(user: User): void {
       const dialogRef = this.dialog.open(PasswordResetDialogComponent, {
           ...FORM_DIALOG_OPTIONS,
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
