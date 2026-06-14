import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgbDropdown, NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, interval } from 'rxjs';
import { SharedModule } from '../../../../shared/shared.module';
import { AuthService } from '../../../../../core/services/auth.service';
import { RoleService } from '../../../../../core/services/role.service';
import { LanguageService, AppLanguage } from '../../../../../core/services/language.service';
import { User, UserService } from '../../../../../modules/users/user.service';
import { avatarImagePath, userDisplayName } from '../../../../../core/constants/avatars';
import { AppNotification, NotificationService } from '../../../../../core/services/notification.service';
import { PatientDetailDialogService } from '../../../../../core/services/patient-detail-dialog.service';
import { BrowserHydrationService } from '../../../../../core/utils/browser-init';

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
  private notificationService = inject(NotificationService);
  private patientDetailDialog = inject(PatientDetailDialogService);
  private browserHydration = inject(BrowserHydrationService);

  languages: AppLanguage[] = this.languageService.languages;
  currentUser: User | null = null;

  notifications: AppNotification[] = [];
  unreadCount = 0;
  loadingNotifications = false;

  private sub?: Subscription;
  private pollSub?: Subscription;

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

    this.browserHydration.run(() => {
      this.loadNotifications();
      this.pollSub = interval(60_000).subscribe(() => this.loadNotifications());
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.pollSub?.unsubscribe();
  }

  get newNotifications(): AppNotification[] {
    return this.notifications.filter((n) => !n.read);
  }

  get earlierNotifications(): AppNotification[] {
    return this.notifications.filter((n) => n.read);
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

  loadNotifications(silent = false): void {
    if (!this.authService.isAuthenticated()) {
      return;
    }
    if (!silent && this.notifications.length === 0) {
      this.loadingNotifications = true;
    }
    this.notificationService.getNotifications().subscribe((items) => {
      this.notifications = items;
      this.loadingNotifications = false;
    });
    this.notificationService.getUnreadCount().subscribe((count) => {
      this.unreadCount = count;
    });
  }

  markAllAsRead(event: Event): void {
    event.preventDefault();
    this.notificationService.markAllAsRead().subscribe(() => this.loadNotifications());
  }

  clearAll(event: Event): void {
    event.preventDefault();
    this.notificationService.clearAll().subscribe(() => this.loadNotifications());
  }

  onNotificationClick(notification: AppNotification, event: Event): void {
    event.preventDefault();

    if (!notification.read) {
      this.notificationService.markAsRead(notification.id).subscribe();
      notification.read = true;
      this.unreadCount = Math.max(0, this.unreadCount - 1);
    }

    if (notification.linkRoute) {
      void this.router.navigate([notification.linkRoute]);
      return;
    }

    if (notification.patientId) {
      this.patientDetailDialog.openByPatientId(notification.patientId);
    }
  }

  notificationIcon(notification: AppNotification): string {
    return this.notificationService.iconFor(notification.category);
  }

  formatRelativeTime(isoDate: string): string {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    const diffMs = Date.now() - date.getTime();
    const minutes = Math.floor(diffMs / 60_000);
    if (minutes < 1) return 'maintenant';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} h`;
    const days = Math.floor(hours / 24);
    return `${days} j`;
  }

  private loadCurrentUser(): void {
    const userId = this.authService.getCurrentUserId();
    const username = this.authService.getCurrentUsername();

    this.userService.resolveUser(userId, username).subscribe((user) => {
      this.currentUser = user;
    });
  }
}
