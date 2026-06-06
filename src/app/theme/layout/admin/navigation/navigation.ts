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
    type: 'group',
    children: [
      { id: 'dashboard', title: 'Dashboard', type: 'item', url: '/dashboard', icon: 'feather icon-home' },
      { id: 'packs', title: 'Packs', type: 'item', url: '/packs', icon: 'feather icon-package' },
      { id: 'patients', title: 'Patients', type: 'item', url: '/patients', icon: 'feather icon-users' },
      { id: 'seances', title: 'Séances', type: 'item', url: '/seances', icon: 'feather icon-calendar' },
      { id: 'payments', title: 'Paiements', type: 'item', url: '/payments', icon: 'feather icon-credit-card' },
      { id: 'sales-stock', title: 'Ventes & Stock', type: 'item', url: '/sales-stock', icon: 'feather icon-shopping-cart' },
      { id: 'expenses', title: 'Charges', type: 'item', url: '/expenses', icon: 'feather icon-dollar-sign' },
      { id: 'users', title: 'Utilisateurs', type: 'item', url: '/users', icon: 'feather icon-user' },
    ]
  }
];