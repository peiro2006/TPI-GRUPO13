import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService, PronosticoPartido, RankingUsuario } from '../../auth.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="perfil-page">
      @if (loading) {
        <p class="loading">Cargando perfil...</p>
      } @else if (errorMsg) {
        <div class="error-card">
          <p>{{ errorMsg }}</p>
          <a routerLink="/" class="btn-volver">← Volver al inicio</a>
        </div>
      } @else if (usuario) {
        <div class="perfil-card">
          <div class="perfil-avatar">⚽</div>
          <h1>{{ usuario.nombre }} {{ usuario.apellido }}</h1>
          <p class="email">{{ usuario.email }}</p>

          <div class="stats">
            <div class="stat">
              <span class="stat-valor">{{ posicionTexto }}</span>
              <span class="stat-label">Posición</span>
            </div>
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

          <a routerLink="/" class="btn-volver">← Volver al inicio</a>
        </div>

        @if (pronosticos.length > 0) {
          <div class="pronosticos-section">
            <h2>Pronósticos de {{ usuario.nombre }}</h2>
            <div class="pronosticos-lista">
              @for (p of pronosticos; track p.partidoId) {
                <div class="pronostico-card">
                  <div class="card-header">
                    <span class="fecha">{{ p.fechaPartido }}</span>
                    <span class="estado">{{ p.estadoPartido }}</span>
                  </div>
                  <div class="card-body">
                    <span class="equipo">{{ p.local }}</span>
                    <span class="marcador">{{ p.golesLocal != null ? p.golesLocal : '?' }} - {{ p.golesVisitante != null ? p.golesVisitante : '?' }}</span>
                    <span class="equipo">{{ p.visitante }}</span>
                  </div>
                </div>
              }
            </div>
          </div>
        }
      } @else {
        <p class="loading">Usuario no encontrado</p>
      }
    </div>
  `,
  styles: [`
    .perfil-page {
      min-height: calc(100vh - 70px); display: flex; align-items: center;
      justify-content: center; padding: 40px 20px; flex-direction: column;
      background: linear-gradient(135deg, #1a472a 0%, #2d7a3a 50%, #1a472a 100%);
    }
    .loading { color: #fff; font-size: 18px; }
    .error-card {
      background: #fff; border-radius: 16px; padding: 40px;
      text-align: center; color: #c62828;
    }
    .perfil-card {
      background: #fff; border-radius: 16px; padding: 48px 40px;
      max-width: 520px; width: 100%; text-align: center;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3); margin-bottom: 24px;
    }
    .perfil-avatar { font-size: 64px; margin-bottom: 16px; }
    .perfil-card h1 { font-size: 28px; font-weight: 800; color: #1a472a; margin: 0 0 4px 0; }
    .email { color: #666; font-size: 14px; margin: 0 0 32px 0; }
    .stats {
      display: flex; justify-content: center; gap: 24px; margin-bottom: 32px; flex-wrap: wrap;
    }
    .stat { display: flex; flex-direction: column; align-items: center; min-width: 70px; }
    .stat-valor { font-size: 28px; font-weight: 800; color: #2d7a3a; }
    .stat-label { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; }
    .btn-volver {
      display: inline-block; padding: 12px 24px;
      background: linear-gradient(135deg, #2d7a3a, #1a5c2a);
      color: #fff; text-decoration: none; border-radius: 10px;
      font-weight: 600; font-size: 14px; transition: all 0.2s;
    }
    .btn-volver:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(45,122,58,0.4); }
    .pronosticos-section {
      max-width: 520px; width: 100%;
    }
    .pronosticos-section h2 {
      color: #fff; font-size: 20px; font-weight: 700; text-align: center; margin-bottom: 16px;
    }
    .pronosticos-lista { display: flex; flex-direction: column; gap: 10px; }
    .pronostico-card {
      background: #fff; border-radius: 12px; padding: 14px 18px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.1);
    }
    .card-header {
      display: flex; justify-content: space-between; margin-bottom: 8px;
      font-size: 12px; color: #888;
    }
    .card-body {
      display: flex; justify-content: space-between; align-items: center;
      font-size: 15px; font-weight: 600; color: #1a472a;
    }
    .marcador { font-size: 18px; font-weight: 800; color: #2d7a3a; }

    @media (max-width: 600px) {
      .perfil-page { padding: 20px 12px; }
      .perfil-card { padding: 28px 20px; }
      .perfil-card h1 { font-size: 22px; }
      .stats { gap: 16px; }
      .stat-valor { font-size: 22px; }
      .pronosticos-section h2 { font-size: 17px; }
      .pronostico-card { padding: 12px 14px; }
      .card-body { font-size: 13px; flex-wrap: wrap; gap: 6px; }
      .marcador { font-size: 15px; }
    }
  `]
})
export class PerfilComponent implements OnInit {
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  usuario: RankingUsuario | null = null;
  pronosticos: PronosticoPartido[] = [];
  loading = true;
  errorMsg = '';
  posicionTexto = '—';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.errorMsg = 'ID de usuario inválido';
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    this.auth.getPerfil(id).subscribe({
      next: (u) => {
        this.usuario = u;
        this.posicionTexto = u.posicion != null ? String(u.posicion) : '—';
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMsg = err.error?.error || err.message || 'Error al cargar el perfil';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });

    this.auth.getPronosticosUsuario(id).subscribe({
      next: (p) => {
        this.pronosticos = p;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cdr.detectChanges();
      }
    });
  }
}
