import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'perfil/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./perfil/perfil.component').then(m => m.PerfilComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
  },
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
