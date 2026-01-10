import  {  Component,  Inject }  from  '@angular/core';
import {  FormBuilder,  FormGroup,  Validators }  from  '@angular/forms';
import {  MatDialogRef,  MAT_DIALOG_DATA, MatDialogModule  } from  '@angular/material/dialog';
import  { UserService,  User  }  from '../user.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
   selector:  'app-user-form',
   templateUrl:  './user-form.component.html',
   styleUrls:  ['./user-form.component.scss'],
   standalone: true,
   imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatDialogModule]
})
export  class  UserFormComponent  {
   form:  FormGroup;
   roles  = ['ADMIN',  'KINE',  'ASSISTANT',  'TRAINER'];

    constructor(
      private  fb:  FormBuilder,
       private userService:  UserService,
       private  dialogRef: MatDialogRef<UserFormComponent>,
       @Inject(MAT_DIALOG_DATA)  public  data: User
    ) {
       this.form  =  this.fb.group({
          username:  [data?.username ||  '',  Validators.required],
          email:  [data?.email  || '',  [Validators.required,  Validators.email]],
          password:  [data?.password  || '',  data  ?  [] :  [Validators.required]],
          role:  [data?.role  ||  '', Validators.required],
           enabled: [data?.enabled  ??  true,  Validators.required]
      });
    }

    save(): void  {
       if  (this.form.valid) {
           const user  =  this.form.value;
          if  (this.data?.id)  {
             this.userService.updateUser(this.data.id,  user).subscribe(()  =>  this.dialogRef.close(true));
          }  else {
              this.userService.addUser(user).subscribe(()  =>  this.dialogRef.close(true));
          }
       }
   }

   cancel():  void {
       this.dialogRef.close(false);
   }
}
