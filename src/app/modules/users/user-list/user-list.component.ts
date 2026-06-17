import  { Component  }  from '@angular/core';
import  {  MatDialog }  from  '@angular/material/dialog';
import {  UserService,  User  } from  '../user.service';
import  { UserFormComponent  }  from  '../user-form/user-form.component';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { CardComponent } from '../../../theme/shared/components/card/card.component';
import { TranslateModule } from '@ngx-translate/core';
import { FORM_DIALOG_OPTIONS } from '../../../core/constants/dialog.config';
import { BrowserHydrationService } from '../../../core/utils/browser-init';
import { DeleteConfirmService } from '../../../core/services/delete-confirm.service';
import { DialogRefreshService } from '../../../core/services/dialog-refresh.service';
import { avatarImagePath, userDisplayName } from '../../../core/constants/avatars';

@Component({
    selector:  'app-user-list',
    templateUrl:  './user-list.component.html',
    styleUrls: ['./user-list.component.scss'],
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, InputTextModule, IconFieldModule, InputIconModule, TagModule, CardComponent, TranslateModule]
})
export class  UserListComponent {
   users:  User[]  = [];
   loading: boolean = true;
   readonly avatarImagePath = avatarImagePath;
   readonly userDisplayName = userDisplayName;

   constructor(
     private userService: UserService,
     private dialog: MatDialog,
     private browserHydration: BrowserHydrationService,
     private deleteConfirm: DeleteConfirmService,
     private dialogRefresh: DialogRefreshService
   ) {
       this.browserHydration.run(() => this.loadUsers());
   }

   loadUsers():  void  {
       this.loading = true;
       this.userService.getUsers().subscribe(data => {
           this.users  =  [...data];
           this.loading = false;
       });
   }

   addUser():  void {
       this.dialogRefresh.onSave(
         this.dialog.open(UserFormComponent, FORM_DIALOG_OPTIONS),
         () => this.loadUsers()
       );
   }

   editUser(user:  User):  void  {
      this.dialogRefresh.onSave(
        this.dialog.open(UserFormComponent, { ...FORM_DIALOG_OPTIONS, data: user }),
        () => this.loadUsers()
      );
   }

   deleteUser(id:  number):  void {
       this.deleteConfirm.confirmAndDelete(
         () => this.userService.deleteUser(id),
         () => this.loadUsers()
       );
   }

   clear(table: any): void {
       table.clear();
   }
}
