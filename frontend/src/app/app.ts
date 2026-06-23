import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected auth = inject(AuthService);

  protected userName = computed(() => {
    const usuario = localStorage.getItem('usuario');
    if (!usuario) return '';
    const parsed = JSON.parse(usuario);
    return parsed.nombre || '';
  });

  protected esAdmin = computed(() => {
    const usuario = localStorage.getItem('usuario');
    if (!usuario) return false;
    try { return JSON.parse(usuario).rol === 'ADMIN'; } catch { return false; }
  });

  logout(): void {
    this.auth.logout();
    window.location.href = '/login';
  }
}
