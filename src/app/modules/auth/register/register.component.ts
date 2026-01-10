import  {  Component  } from  '@angular/core';
import  { FormBuilder,  FormGroup,  Validators  } from  '@angular/forms';
import  { Router  }  from  '@angular/router';
import  {  AuthService  } from  '../../../core/services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
   selector:  'app-register',
   templateUrl:  './register.component.html',
   styleUrls: ['./register.component.scss'],
   standalone: true,
   imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule]
})
export  class  RegisterComponent {
    form: FormGroup;

   constructor(private  fb:  FormBuilder,  private authService:  AuthService,  private  router: Router)  {
       this.form  = this.fb.group({
           username: ['',  Validators.required],
          email:  ['',  [Validators.required,  Validators.email]],
          password:  ['', Validators.required]
       });
   }

   register():  void  {
       if (this.form.valid)  {
          this.authService.register(this.form.value).subscribe(()  =>  {
              this.router.navigate(['/login']);
          });
       }
   }
}
