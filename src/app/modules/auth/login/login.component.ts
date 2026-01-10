import {  Component  }  from '@angular/core';
import  {  FormBuilder, FormGroup,  Validators  }  from '@angular/forms';
import  {  Router }  from  '@angular/router';
import {  AuthService  }  from '../../../core/services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
   selector:  'app-login',
   templateUrl:  './login.component.html',
   styleUrls: ['./login.component.scss'],
   standalone: true,
   imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule]
})
export  class  LoginComponent  {
   form:  FormGroup;
   errorMessage:  string =  '';

   constructor(private  fb:  FormBuilder, private  authService:  AuthService,  private router:  Router)  {
       this.form =  this.fb.group({
          username:  ['',  Validators.required],
          password:  ['',  Validators.required]
      });
    }

    login(): void  {
       if  (this.form.valid) {
           this.authService.login(this.form.value).subscribe({
             next:  (res)  =>  {
                 this.authService.saveToken(res.token);
                 this.router.navigate(['/dashboard']);
              },
              error: ()  =>  {
                 this.errorMessage  =  'Identifiants invalides';
              }
          });
       }
   }
}
