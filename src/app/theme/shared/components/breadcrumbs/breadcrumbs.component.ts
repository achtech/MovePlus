// Angular Import
import { Component, Input, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule, Event } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

// project import
import { NavigationItem, NavigationItems } from 'src/app/theme/layout/admin/navigation/navigation';
import { SharedModule } from '../../shared.module';

interface titleType {
  url: string | boolean | undefined;
  title: string;
  breadcrumbs: unknown;
  type: string;
}

@Component({
  selector: 'app-breadcrumb',
  imports: [CommonModule, RouterModule, SharedModule],
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnDestroy {
  private route = inject(Router);
  private titleService = inject(Title);
  private translate = inject(TranslateService);
  private langSub?: Subscription;

  @Input() type = 'theme1';

  navigations: NavigationItem[];
  breadcrumbList: string[] = [];
  navigationList!: titleType[];

  constructor() {
    this.navigations = NavigationItems;
    this.setBreadcrumb();
    this.langSub = this.translate.onLangChange.subscribe(() => this.updateFromCurrentRoute());
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
  }

  setBreadcrumb() {
    this.route.events.subscribe((router: Event) => {
      if (router instanceof NavigationEnd) {
        this.updateFromUrl(router.urlAfterRedirects || router.url);
      }
    });
  }

  private updateFromCurrentRoute(): void {
    this.updateFromUrl(this.route.url);
  }

  private updateFromUrl(url: string): void {
    const breadcrumbList = this.filterNavigation(this.navigations, url);
    this.navigationList = breadcrumbList;
    const title = breadcrumbList[breadcrumbList.length - 1]?.title || this.translate.instant('app.welcome');
    this.titleService.setTitle(`${title} | ${this.translate.instant('app.name')}`);
  }

  private getNavTitle(item: NavigationItem): string {
    return item.translate ? this.translate.instant(item.translate) : item.title;
  }

  filterNavigation(navItems: NavigationItem[], activeLink: string): titleType[] {
    for (const navItem of navItems) {
      if (navItem.type === 'item' && navItem.url === activeLink) {
        return [
          {
            url: navItem.url,
            title: this.getNavTitle(navItem),
            breadcrumbs: navItem.breadcrumbs ?? true,
            type: navItem.type
          }
        ];
      }
      if ((navItem.type === 'group' || navItem.type === 'collapse') && navItem.children) {
        const breadcrumbList = this.filterNavigation(navItem.children, activeLink);
        if (breadcrumbList.length > 0) {
          breadcrumbList.unshift({
            url: navItem.url,
            title: this.getNavTitle(navItem),
            breadcrumbs: navItem.breadcrumbs ?? true,
            type: navItem.type
          });
          return breadcrumbList;
        }
      }
    }
    return [];
  }
}
