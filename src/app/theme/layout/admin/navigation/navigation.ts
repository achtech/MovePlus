export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: NavigationItem[];
}

export const NavigationItems: NavigationItem[] = [
  {
    id: 'main',
    title: 'Move + Clinic',
    translate: 'nav.group',
    type: 'group',
    children: [
      { id: 'dashboard', title: 'Dashboard', translate: 'nav.dashboard', type: 'item', url: '/dashboard', icon: 'icon-home' },
      { id: 'packs', title: 'Packs', translate: 'nav.packs', type: 'item', url: '/packs', icon: 'icon-package' },
      { id: 'patients', title: 'Patients', translate: 'nav.patients', type: 'item', url: '/patients', icon: 'icon-users' },
      { id: 'seances', title: 'Sessions', translate: 'nav.seances', type: 'item', url: '/seances', icon: 'icon-calendar' },
      { id: 'payments', title: 'Payments', translate: 'nav.payments', type: 'item', url: '/payments', icon: 'icon-credit-card' },
      { id: 'sales-stock', title: 'Sales & Stock', translate: 'nav.salesStock', type: 'item', url: '/sales-stock', icon: 'icon-shopping-cart' },
      { id: 'expenses', title: 'Expenses', translate: 'nav.expenses', type: 'item', url: '/expenses', icon: 'icon-file-text' },
      { id: 'users', title: 'Users', translate: 'nav.users', type: 'item', url: '/users', icon: 'icon-user' }
    ]
  }
];
