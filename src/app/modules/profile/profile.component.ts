import { Component, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { CardComponent } from '../../theme/shared/components/card/card.component';
import { AuthService } from '../../core/services/auth.service';
import { User, UserService } from '../users/user.service';
import { USER_AVATARS, avatarImagePath, userDisplayName } from '../../core/constants/avatars';
import { runAfterBrowserHydration } from '../../core/utils/browser-init';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, CardComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnDestroy {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  private translate = inject(TranslateService);

  private sub?: Subscription;

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

  constructor() {
    runAfterBrowserHydration(() => this.loadProfile());
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
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
    if (!this.user?.id || this.form.invalid) {
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { firstName, lastName, phone, address, avatar, password } = this.form.value;
    const updated: User = {
      ...this.user,
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
        this.user = saved;
        this.saving = false;
        this.editing = false;
        this.showPassword = false;
        this.successMessage = this.translate.instant('profile.updateSuccess');
      },
      error: () => {
        this.saving = false;
        this.errorMessage = this.translate.instant('profile.updateError');
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
      firstName: [user.firstName ?? '', Validators.required],
      lastName: [user.lastName ?? '', Validators.required],
      phone: [user.phone ?? ''],
      address: [user.address ?? ''],
      avatar: [user.avatar ?? 'avatar-1.jpg', Validators.required],
      password: ['']
    });
  }
}
