import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'fechas',
    loadComponent: () => import('./components/fechas.component/fechas.component').then(c => c.FechasComponent)
  },
 {
    path: 'home-admin',
    loadComponent: () => import('./components/home-admin/home-admin').then(c => c.HomeAdmin)
  },
 {
    path: 'admin/fechas/:id/partidos',
    loadComponent: () => import('./components/partidos/partidos').then(c => c.PartidosComponent)
 }


];
