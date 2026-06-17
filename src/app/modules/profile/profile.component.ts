import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription, filter } from 'rxjs';
import { CardComponent } from '../../theme/shared/components/card/card.component';
import { AuthService } from '../../core/services/auth.service';
import { PlatformService } from '../../core/services/platform.service';
import { User, UserService } from '../users/user.service';
import { USER_AVATARS, avatarImagePath, userDisplayName } from '../../core/constants/avatars';
import { getFormValidationMessage, getApiErrorMessage, FORM_SAVE_ERROR } from '../../core/utils/form-submit.utils';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, CardComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private platform = inject(PlatformService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private translate = inject(TranslateService);

  private sub?: Subscription;
  private routerSub?: Subscription;
  private profileOpenSub?: Subscription;

  user: User | null = null;
  form!: FormGroup;
  editing = false;
  loading = true;
  saving = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;

  readonly hiddenPassword = '••••••••';

  readonly avatars = USER_AVATARS;
  readonly avatarImagePath = avatarImagePath;

  ngOnInit(): void {
    if (!this.platform.isBrowser) {
      return;
    }

    this.loadProfile();

    this.profileOpenSub = this.userService.onProfileOpenRequested().subscribe(() => {
      this.loadProfile();
    });

    this.routerSub = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (event.urlAfterRedirects.startsWith('/profile')) {
          this.loadProfile();
        }
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.routerSub?.unsubscribe();
    this.profileOpenSub?.unsubscribe();
  }

  get displayName(): string {
    return this.user ? userDisplayName(this.user) : '';
  }

  get avatarSrc(): string {
    return avatarImagePath(this.user?.avatar ?? 'avatar-1.jpg');
  }

  loadProfile(): void {
    this.loading = true;
    this.errorMessage = '';
    this.editing = false;
    this.successMessage = '';

    const userId = this.authService.getCurrentUserId();
    const username = this.authService.getCurrentUsername();

    this.sub?.unsubscribe();
    this.sub = this.userService.resolveUser(userId, username).subscribe({
      next: (user) => {
        this.user = user;
        this.loading = false;
        if (!user) {
          this.errorMessage = this.translate.instant('profile.loadError');
        } else {
          this.buildForm(user);
        }
      },
      error: () => {
        this.loading = false;
        this.errorMessage = this.translate.instant('profile.loadError');
      }
    });
  }

  startEdit(): void {
    if (!this.user) {
      return;
    }
    this.editing = true;
    this.successMessage = '';
    this.errorMessage = '';
    this.buildForm(this.user);
  }

  cancelEdit(): void {
    this.editing = false;
    this.showPassword = false;
    this.errorMessage = '';
    if (this.user) {
      this.buildForm(this.user);
    }
  }

  selectAvatar(filename: string): void {
    if (!this.editing) {
      return;
    }
    this.form.patchValue({ avatar: filename });
  }

  saveProfile(): void {
    if (!this.user?.id) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    const validationError = getFormValidationMessage(this.form, {
      username: 'nom d\'utilisateur',
      email: 'email',
      firstName: 'prénom',
      lastName: 'nom'
    });
    if (validationError) {
      this.errorMessage = validationError;
      return;
    }

    this.saving = true;

    const { username, email, firstName, lastName, phone, address, avatar, password } = this.form.value;
    const updated: User = {
      ...this.user,
      username: username?.trim(),
      email: email?.trim(),
      firstName: firstName?.trim(),
      lastName: lastName?.trim(),
      phone: phone?.trim(),
      address: address?.trim(),
      avatar
    };

    if (password?.trim()) {
      updated.password = password.trim();
    }

    this.userService.updateUser(this.user.id, updated).subscribe({
      next: (saved) => {
        if (!saved) {
          this.saving = false;
          this.errorMessage = this.translate.instant('profile.updateError');
          return;
        }
        this.user = saved;
        this.saving = false;
        this.editing = false;
        this.showPassword = false;
        this.successMessage = this.translate.instant('profile.updateSuccess');
      },
      error: (err) => {
        this.saving = false;
        this.errorMessage = getApiErrorMessage(
          err,
          this.translate.instant('profile.updateError') || FORM_SAVE_ERROR
        );
      }
    });
  }

  isSelectedAvatar(filename: string): boolean {
    const current = this.editing ? this.form.get('avatar')?.value : this.user?.avatar;
    return (current ?? 'avatar-1.jpg') === filename;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  private buildForm(user: User): void {
    this.form = this.fb.group({
      username: [user.username ?? '', Validators.required],
      email: [user.email ?? '', [Validators.required, Validators.email]],
      firstName: [user.firstName ?? '', Validators.required],
      lastName: [user.lastName ?? '', Validators.required],
      phone: [user.phone ?? ''],
      address: [user.address ?? ''],
      avatar: [user.avatar ?? 'avatar-1.jpg', Validators.required],
      password: ['']
    });
  }
}
