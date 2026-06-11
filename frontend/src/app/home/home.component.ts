import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  template: `
    <div class="home-page">
      <div class="hero">
        <div class="ball-icon">⚽</div>
        <h1>Bienvenido, {{ userName() }}</h1>
        <p class="subtitle">ProdeGol — Pronosticá los partidos y competí en el ranking</p>
      </div>

      <div class="cards">
        <div class="card">
          <span class="card-icon">📋</span>
          <h3>Próximos Partidos</h3>
          <p>Pronosticá los resultados de los próximos encuentros</p>
        </div>

        <div class="card">
          <span class="card-icon">🏆</span>
          <h3>Ranking</h3>
          <p>Competí con otros usuarios y subí en la tabla</p>
        </div>

        @if (role() === 'ADMIN') {
          <div class="card admin-card">
            <span class="card-icon">⚙️</span>
            <h3>Administración</h3>
            <p>Gestioná equipos, partidos y resultados</p>
          </div>
        }
      </div>

      <div class="usuario-info">
        <p><strong>Email:</strong> {{ email() }}</p>
        @if (clan()) {
          <p><strong>Clan:</strong> {{ clan() }}</p>
        }
        <p><strong>Rol:</strong> {{ role() }}</p>
      </div>
    </div>
  `,
  styles: [`
    .home-page {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .hero {
      text-align: center;
      margin-bottom: 48px;
    }
    .ball-icon { font-size: 64px; margin-bottom: 16px; }
    .hero h1 {
      font-size: 32px;
      font-weight: 800;
      color: #1a472a;
      margin: 0 0 8px 0;
    }
    .subtitle {
      font-size: 16px;
      color: #666;
      margin: 0;
    }
    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }
    .card {
      background: #fff;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
      text-align: center;
      transition: transform 0.2s;
    }
    .card:hover { transform: translateY(-4px); }
    .card-icon { font-size: 36px; display: block; margin-bottom: 12px; }
    .card h3 {
      font-size: 18px;
      font-weight: 700;
      color: #1a472a;
      margin: 0 0 8px 0;
    }
    .card p {
      font-size: 14px;
      color: #666;
      margin: 0;
      line-height: 1.5;
    }
    .admin-card {
      border: 2px solid #ffd700;
      background: linear-gradient(135deg, #fff, #fffde7);
    }
    .usuario-info {
      background: #fff;
      border-radius: 12px;
      padding: 20px 24px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
    }
    .usuario-info p {
      font-size: 14px;
      color: #444;
      margin: 4px 0;
    }
    .usuario-info strong { color: #1a472a; }
  `]
})
export class HomeComponent {
  private auth = inject(AuthService);

  protected userName = computed(() => {
    const u = localStorage.getItem('usuario');
    if (!u) return '';
    return JSON.parse(u).nombre || '';
  });

  protected email = computed(() => {
    const u = localStorage.getItem('usuario');
    if (!u) return '';
    return JSON.parse(u).email || '';
  });

  protected role = computed(() => {
    const u = localStorage.getItem('usuario');
    if (!u) return '';
    return JSON.parse(u).rol || '';
  });

  protected clan = computed(() => {
    const u = localStorage.getItem('usuario');
    if (!u) return '';
    return JSON.parse(u).clan || null;
  });
}
