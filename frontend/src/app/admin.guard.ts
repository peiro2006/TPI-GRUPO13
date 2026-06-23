import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

export function adminGuard() {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    return router.parseUrl('/login');
  }

  const usuario = localStorage.getItem('usuario');
  if (!usuario) {
    return router.parseUrl('/login');
  }

  try {
    const parsed = JSON.parse(usuario);
    if (parsed.rol !== 'ADMIN') {
      return router.parseUrl('/');
    }
  } catch {
    return router.parseUrl('/login');
  }

  return true;
}
