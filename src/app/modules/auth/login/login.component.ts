import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService, LoginRequest } from '../../../core/services/auth.service';
import { getFormValidationMessage, getApiErrorMessage } from '../../../core/utils/form-submit.utils';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslateModule]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private translate = inject(TranslateService);

  form: FormGroup;
  errorMessage = '';
  loading = false;
  showPassword = false;

  constructor() {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  login(): void {
    this.errorMessage = '';
    const validationError = getFormValidationMessage(this.form, {
      username: 'nom d\'utilisateur',
      password: 'mot de passe'
    });
    if (validationError) {
      this.errorMessage = validationError;
      return;
    }

    this.loading = true;
    const credentials: LoginRequest = this.form.value;
    this.authService.login(credentials).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = getApiErrorMessage(
          err,
          this.translate.instant('auth.invalidCredentials')
        );
      }
    });
  }
}
