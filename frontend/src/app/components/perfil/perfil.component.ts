import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService, RankingUsuario } from '../../auth.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="perfil-page">
      @if (loading) {
        <p class="loading">Cargando perfil...</p>
      } @else if (usuario) {
        <div class="perfil-card">
          <div class="perfil-avatar">⚽</div>
          <h1>{{ usuario.nombre }} {{ usuario.apellido }}</h1>
          <p class="email">{{ usuario.email }}</p>

          <div class="stats">
            <div class="stat">
              <span class="stat-valor">{{ usuario.puntos }}</span>
              <span class="stat-label">Puntos</span>
            </div>
            <div class="stat">
              <span class="stat-valor">{{ usuario.pronosticos }}</span>
              <span class="stat-label">Pronósticos</span>
            </div>
            <div class="stat">
              <span class="stat-valor">{{ usuario.clan || '—' }}</span>
              <span class="stat-label">Clan</span>
            </div>
          </div>

          <a routerLink="/ranking" class="btn-volver">← Volver al ranking</a>
        </div>
      } @else {
        <p class="loading">Usuario no encontrado</p>
      }
    </div>
  `,
  styles: [`
    .perfil-page {
      min-height: calc(100vh - 70px); display: flex; align-items: center;
      justify-content: center; padding: 40px 20px;
      background: linear-gradient(135deg, #1a472a 0%, #2d7a3a 50%, #1a472a 100%);
    }
    .loading { color: #fff; font-size: 18px; }
    .perfil-card {
      background: #fff; border-radius: 16px; padding: 48px 40px;
      max-width: 480px; width: 100%; text-align: center;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    .perfil-avatar { font-size: 64px; margin-bottom: 16px; }
    .perfil-card h1 { font-size: 28px; font-weight: 800; color: #1a472a; margin: 0 0 4px 0; }
    .email { color: #666; font-size: 14px; margin: 0 0 32px 0; }
    .stats {
      display: flex; justify-content: center; gap: 32px; margin-bottom: 32px;
    }
    .stat { display: flex; flex-direction: column; align-items: center; }
    .stat-valor { font-size: 28px; font-weight: 800; color: #2d7a3a; }
    .stat-label { font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; }
    .btn-volver {
      display: inline-block; padding: 12px 24px;
      background: linear-gradient(135deg, #2d7a3a, #1a5c2a);
      color: #fff; text-decoration: none; border-radius: 10px;
      font-weight: 600; font-size: 14px; transition: all 0.2s;
    }
    .btn-volver:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(45,122,58,0.4); }
  `]
})
export class PerfilComponent implements OnInit {
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);

  usuario: RankingUsuario | null = null;
  loading = true;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.auth.getPerfil(id).subscribe({
        next: (u) => { this.usuario = u; this.loading = false; },
        error: () => this.loading = false
      });
    } else {
      this.loading = false;
    }
  }
}
