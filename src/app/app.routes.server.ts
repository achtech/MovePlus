import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: 'login', renderMode: RenderMode.Prerender },
  { path: 'login/register', renderMode: RenderMode.Prerender },
  { path: 'dashboard', renderMode: RenderMode.Server },
  { path: 'packs', renderMode: RenderMode.Server },
  { path: 'patients', renderMode: RenderMode.Server },
  { path: 'seances', renderMode: RenderMode.Server },
  { path: 'payments', renderMode: RenderMode.Server },
  { path: 'sales-stock', renderMode: RenderMode.Server },
  { path: 'expenses', renderMode: RenderMode.Server },
  { path: 'users', renderMode: RenderMode.Server },
  { path: 'profile', renderMode: RenderMode.Server },
  { path: '**', renderMode: RenderMode.Server }
];
