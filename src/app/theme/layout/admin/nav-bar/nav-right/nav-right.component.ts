import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgbDropdown, NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { SharedModule } from '../../../../shared/shared.module';
import { AuthService } from '../../../../../core/services/auth.service';
import { RoleService } from '../../../../../core/services/role.service';
import { LanguageService, AppLanguage } from '../../../../../core/services/language.service';
import { User, UserService } from '../../../../../modules/users/user.service';
import { avatarImagePath, userDisplayName } from '../../../../../core/constants/avatars';

@Component({
  selector: 'app-nav-right',
  imports: [SharedModule, RouterModule],
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  providers: [NgbDropdownConfig]
})
export class NavRightComponent implements OnInit, OnDestroy {
  @ViewChild('userDropdown') userDropdown?: NgbDropdown;

  private authService = inject(AuthService);
  private roleService = inject(RoleService);
  private router = inject(Router);
  private languageService = inject(LanguageService);
  private userService = inject(UserService);

  languages: AppLanguage[] = this.languageService.languages;
  currentUser: User | null = null;

  private sub?: Subscription;

  constructor() {
    const config = inject(NgbDropdownConfig);
    config.placement = 'bottom-end';
    config.autoClose = true;
  }

  ngOnInit(): void {
    this.loadCurrentUser();
    this.sub = this.userService.onProfileUpdated().subscribe((user) => {
      this.currentUser = user;
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  get displayName(): string {
    return this.currentUser ? userDisplayName(this.currentUser) : this.authService.getCurrentUsername() ?? '';
  }

  get avatarSrc(): string {
    return avatarImagePath(this.currentUser?.avatar ?? 'avatar-1.jpg');
  }

  selectLanguage(code: string): void {
    this.languageService.setLanguage(code).subscribe();
  }

  isCurrentLanguage(code: string): boolean {
    return this.languageService.currentLanguage === code;
  }

  logout(): void {
    this.roleService.clear();
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToProfile(event: Event): void {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.userDropdown?.close();

    void this.router.navigate(['/profile']).then(() => {
      this.userService.notifyProfileOpen();
    });
  }

  private loadCurrentUser(): void {
    const userId = this.authService.getCurrentUserId();
    const username = this.authService.getCurrentUsername();

    this.userService.resolveUser(userId, username).subscribe((user) => {
      this.currentUser = user;
    });
  }
}
