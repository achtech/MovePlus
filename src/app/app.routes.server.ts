import { RenderMode, ServerRoute } from '@angular/ssr';

/** Client-side rendering for all routes (SPA served by Spring Boot). */
export const serverRoutes: ServerRoute[] = [
  { path: '**', renderMode: RenderMode.Client }
];
