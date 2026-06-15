import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'perfil/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./components/perfil/perfil.component').then(m => m.PerfilComponent)
  },
  {
    path: 'home-cliente',
    canActivate: [authGuard],
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'fechas',
    pathMatch: 'full',
    loadComponent: () => import('./components/fechas.component/fechas.component').then(c => c.FechasComponent)
  },
 {
    path: 'home-admin',
    loadComponent: () => import('./components/home-admin/home-admin').then(c => c.HomeAdmin)
  },
  {
     path: 'admin/fechas/:id/partidos',
     loadComponent: () => import('./components/partidos/partidos').then(c => c.PartidosComponent)
  },
  {
     path: 'fechas/:id/partidos',
     loadComponent: () => import('./components/partidos-cliente/partidos-cliente').then(c => c.PartidosCliente)
  }

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
    path: 'equipos',
    canActivate: [authGuard],
    loadComponent: () => import('./equipos/equipos.component').then(m => m.EquiposComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
  }
];
