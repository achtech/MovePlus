import  {  Component,  Inject }  from  '@angular/core';
import {  FormBuilder,  FormGroup,  Validators }  from  '@angular/forms';
import {  MatDialogRef,  MAT_DIALOG_DATA, MatDialogModule  } from  '@angular/material/dialog';
import  { UserService,  User  }  from '../user.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
   selector:  'app-user-form',
   templateUrl:  './user-form.component.html',
   styleUrls:  ['./user-form.component.scss'],
   standalone: true,
   imports: [CommonModule, ReactiveFormsModule, MatDialogModule]
})
export  class  UserFormComponent  {
   form:  FormGroup;
   roles  = ['ADMIN', 'ASSISTANT'];

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
          confirmPassword:  ['',  data  ?  [] :  [Validators.required]],
          role:  [data?.role  ||  '', Validators.required],
           enabled: [data?.enabled  ??  true,  Validators.required]
      }, { validators: data ? null : UserFormComponent.passwordMatchValidator });
    }

    save(): void {
      if (!this.form.valid) {
        return;
      }

      const formValue = { ...this.form.value };
      delete formValue.confirmPassword;

      if (this.data?.id) {
        const user: User = { ...this.data, ...formValue };
        if (!formValue.password) {
          delete user.password;
        }
        this.userService.updateUser(this.data.id, user).subscribe({
          next: () => this.dialogRef.close(true),
          error: () => {}
        });
      } else {
        this.userService.addUser(formValue).subscribe({
          next: () => this.dialogRef.close(true),
          error: () => {}
        });
      }
    }

   static passwordMatchValidator(form: FormGroup) {
       const password = form.get('password');
       const confirmPassword = form.get('confirmPassword');
       
       if (password && confirmPassword && password.value !== confirmPassword.value) {
           confirmPassword.setErrors({ passwordMismatch: true });
           return { passwordMismatch: true };
       }
       
       return null;
   }

   cancel():  void {
       this.dialogRef.close(false);
   }
}
