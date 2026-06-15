import { ChangeDetectorRef, Component, computed, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, RankingUsuario } from '../../auth.service';
import { FechaService, FechaResponse } from '../../services/fecha.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, FormsModule, DatePipe],
  template: `
    <div class="home-page">

      <div class="hero">
        <div class="ball-icon">⚽</div>
        <h1>ProdeGol</h1>
        <p class="subtitle">Bienvenido, {{ userName() }}</p>
      </div>

      <div class="paneles">
        <button class="panel" [class.activo]="seccion === 'ranking'" (click)="seccion = 'ranking'">
          <span class="panel-icon">🏆</span>
          <span class="panel-titulo">Ranking</span>
          <span class="panel-desc">Tabla de posiciones general</span>
        </button>

        <button class="panel" [class.activo]="seccion === 'pronosticos'" (click)="seccion = 'pronosticos'">
          <span class="panel-icon">📋</span>
          <span class="panel-titulo">Pronósticos</span>
          <span class="panel-desc">Registrá tus pronósticos</span>
        </button>

        <button class="panel" [class.activo]="seccion === 'perfil'" (click)="seccion = 'perfil'">
          <span class="panel-icon">👤</span>
          <span class="panel-titulo">Mi Perfil</span>
          <span class="panel-desc">Tus datos y estadísticas</span>
        </button>

        <button class="panel" [class.activo]="seccion === 'fechas'" (click)="seccion = 'fechas'">
                  <span class="panel-icon">📅</span>
                  <span class="panel-titulo">Fixture</span>
                  <span class="panel-desc">Calendario de partidos</span>
        </button>
      </div>

      @if (seccion === 'ranking') {
        @if (puntero && !clanSeleccionado) {
          <div class="puntero-card">
            <div class="crown">👑</div>
            <span class="puntero-label">LÍDER</span>
            <h2 class="puntero-nombre">{{ puntero.nombre }} {{ puntero.apellido }}</h2>
            <div class="puntero-stats">
              <div class="puntero-stat">
                <span class="puntero-stat-valor">{{ puntero.puntos }}</span>
                <span class="puntero-stat-label">Puntos</span>
              </div>
              <div class="puntero-stat">
                <span class="puntero-stat-valor">{{ puntero.pronosticos }}</span>
                <span class="puntero-stat-label">Pronósticos</span>
              </div>
              @if (puntero.clan) {
                <div class="puntero-stat">
                  <span class="puntero-stat-valor">{{ puntero.clan }}</span>
                  <span class="puntero-stat-label">Clan</span>
                </div>
              }
            </div>
          </div>
        }

        <div class="filtros">
          <label>
            Orden:
            <select [(ngModel)]="orden" (change)="cargarRanking()">
              <option value="desc">Mayor puntaje primero</option>
              <option value="asc">Menor puntaje primero</option>
            </select>
          </label>
          <label>
            Clan:
            <select [(ngModel)]="clanSeleccionado" (change)="cargarRanking()">
              <option value="">Todos los clanes</option>
              @for (c of clanes; track c) {
                <option [value]="c">{{ c }}</option>
              }
            </select>
          </label>
        </div>

        <div class="tabla-wrapper">
          <table class="tabla-ranking">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Clan</th>
                <th>Pts</th>
                <th>Pron</th>
              </tr>
            </thead>
            <tbody>
              @for (u of ranking; track u.id) {
                <tr [class.top1]="u.posicion === 1" [class.destacado]="u.id === miId && u.posicion !== 1">
                  <td class="posicion">
                    @if (u.posicion === 1) { 👑 }
                    @else if (u.posicion === 2) { 🥈 }
                    @else if (u.posicion === 3) { 🥉 }
                    @else { {{ u.posicion }} }
                  </td>
                  <td>
                    <a [routerLink]="['/perfil', u.id]" class="link-usuario">{{ u.nombre }} {{ u.apellido }}</a>
                  </td>
                  <td>
                    @if (u.clan) {
                      <a class="link-clan" (click)="filtrarPorClan(u.clan!)">{{ u.clan }}</a>
                    } @else {
                      <span class="sin-clan">—</span>
                    }
                  </td>
                  <td class="puntos">{{ u.puntos }}</td>
                  <td>{{ u.pronosticos }}</td>
                </tr>
              }
              @if (ranking.length === 0) {
                <tr><td colspan="5" class="vacio">No hay usuarios en el ranking</td></tr>
              }
            </tbody>
          </table>
        </div>
      }

      @if (seccion === 'fechas') {
          <div style="display: flex; justify-content: flex-end; margin-bottom: 8px;">
            <button (click)="toggleOrdenFechas()" style="background: linear-gradient(135deg, #1a472a, #2d7a3a); color: #fff; border: none; border-radius: 8px; padding: 8px 16px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; letter-spacing: 0.3px;">
              {{ ordenFechas === 'asc' ? '↑ Más antiguas' : '↓ Más recientes' }}
            </button>
          </div>
        <div class="tabla-wrapper">

          <table class="tabla-ranking">
            <thead>
              <tr>

                <th>Nombre</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody  style="cursor: pointer;" >
              @for (f of fechas; track f.idFecha) {
                <tr (click)="verPartidos(f)">
                  <td>{{ f.nombreFecha }}</td>
                  <td>{{ f.inicioFecha | date:'dd/MM/yyyy' }}</td>
                  <td>{{ f.finFecha | date:'dd/MM/yyyy' }}</td>
                  <td>{{ f.estadoFecha }}</td>
                </tr>
              }
              @if (fechas.length === 0) {
                <tr><td colspan="5" class="vacio">No hay fechas cargadas</td></tr>
              }
            </tbody>
          </table>
        </div>
      }

      @if (seccion === 'pronosticos') {
        <div class="seccion-vacia">
          <span class="seccion-icon">📋</span>
          <h2>Pronósticos</h2>
          <p>Acá vas a poder registrar tus pronósticos para los próximos partidos. ¡Próximamente!</p>
          <div class="partidos-placeholder">
            <div class="partido-placeholder">
              <span>Equipo Local</span>
              <span class="vs">VS</span>
              <span>Equipo Visitante</span>
            </div>
            <div class="partido-placeholder">
              <span>Equipo Local</span>
              <span class="vs">VS</span>
              <span>Equipo Visitante</span>
            </div>
            <div class="partido-placeholder">
              <span>Equipo Local</span>
              <span class="vs">VS</span>
              <span>Equipo Visitante</span>
            </div>
          </div>
        </div>
      }

      @if (seccion === 'perfil') {
        <div class="perfil-card">
          <div class="perfil-avatar">⚽</div>
          <h2>{{ userName() }} {{ apellido() }}</h2>
          <p class="perfil-email">{{ email() }}</p>

          <div class="perfil-stats">
            <div class="perfil-stat">
              <span class="perfil-stat-valor">{{ misPuntos }}</span>
              <span class="perfil-stat-label">Puntos</span>
            </div>
            <div class="perfil-stat">
              <span class="perfil-stat-valor">{{ misPronosticos }}</span>
              <span class="perfil-stat-label">Pronósticos</span>
            </div>
            <div class="perfil-stat">
              <span class="perfil-stat-valor">{{ miClan() || '—' }}</span>
              <span class="perfil-stat-label">Clan</span>
            </div>
          </div>

          <div class="perfil-info">
            <p><strong>Email:</strong> {{ email() }}</p>
            <p><strong>Rol:</strong> {{ role() }}</p>
            @if (miClan()) {
              <p><strong>Clan:</strong> {{ miClan() }}</p>
            }
          </div>
        </div>
      }

    </div>
  `,
  styles: [`
    .home-page { max-width: 960px; margin: 0 auto; padding: 40px 20px; }

    .hero { text-align: center; margin-bottom: 32px; }
    .ball-icon { font-size: 64px; }
    .hero h1 { font-size: 36px; font-weight: 800; color: #1a472a; margin: 8px 0; }
    .subtitle { font-size: 16px; color: #666; margin: 0; }

    .paneles {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
      margin-bottom: 32px;
    }
    .panel {
      background: #fff; border: 2px solid #e8e8e8; border-radius: 16px;
      padding: 28px 20px; text-align: center; cursor: pointer;
      transition: all 0.25s; font-family: inherit;
      display: flex; flex-direction: column; align-items: center; gap: 6px;
    }
    .panel:hover {
      border-color: #2d7a3a; transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(45,122,58,0.12);
    }
    .panel.activo {
      border-color: #2d7a3a; background: #f0faf0;
      box-shadow: 0 4px 16px rgba(45,122,58,0.15);
    }
    .panel-icon { font-size: 42px; }
    .panel-titulo { font-size: 18px; font-weight: 700; color: #1a472a; }
    .panel-desc { font-size: 13px; color: #888; }

    .puntero-card {
      background: linear-gradient(135deg, #ffd700, #ffed4a);
      border-radius: 16px; padding: 32px; text-align: center;
      margin-bottom: 24px; box-shadow: 0 8px 32px rgba(255,215,0,0.3);
      position: relative; overflow: hidden;
    }
    .puntero-card::before {
      content: ''; position: absolute; top: -50%; left: -50%;
      width: 200%; height: 200%;
      background: repeating-linear-gradient(45deg, transparent, transparent 20px,
        rgba(255,255,255,0.1) 20px, rgba(255,255,255,0.1) 40px);
      animation: scrollBg 30s linear infinite;
    }
    @keyframes scrollBg { from { transform: translate(0,0); } to { transform: translate(40px,40px); } }
    .crown { font-size: 56px; position: relative; z-index: 1; }
    .puntero-label {
      display: inline-block; background: #1a472a; color: #ffd700;
      padding: 4px 20px; border-radius: 20px; font-size: 12px; font-weight: 800;
      letter-spacing: 2px; margin-bottom: 8px; position: relative; z-index: 1;
    }
    .puntero-nombre {
      font-size: 28px; font-weight: 800; color: #1a472a;
      margin: 0 0 16px 0; position: relative; z-index: 1;
    }
    .puntero-stats { display: flex; justify-content: center; gap: 32px; position: relative; z-index: 1; }
    .puntero-stat { display: flex; flex-direction: column; align-items: center; }
    .puntero-stat-valor { font-size: 24px; font-weight: 800; color: #1a472a; }
    .puntero-stat-label { font-size: 12px; color: #5a4a00; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; }

    .filtros {
      display: flex; gap: 20px; justify-content: center; margin-bottom: 20px; flex-wrap: wrap;
    }
    .filtros label {
      font-size: 14px; font-weight: 600; color: #333;
      display: flex; align-items: center; gap: 8px;
    }
    .filtros select {
      padding: 8px 12px; border: 2px solid #e0e0e0; border-radius: 8px;
      font-size: 14px; background: #fff; cursor: pointer;
    }
    .filtros select:focus { border-color: #2d7a3a; outline: none; }

    .tabla-wrapper {
      background: #fff; border-radius: 12px; overflow: hidden;
      box-shadow: 0 2px 16px rgba(0,0,0,0.08); margin-bottom: 24px;
    }
    .tabla-ranking { width: 100%; border-collapse: collapse; }
    .tabla-ranking th {
      background: linear-gradient(135deg, #1a472a, #2d7a3a);
      color: #fff; padding: 14px 16px; text-align: left; font-size: 13px;
      text-transform: uppercase; letter-spacing: 0.5px;
    }
    .tabla-ranking td { padding: 14px 16px; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
    .tabla-ranking tr:last-child td { border-bottom: none; }
    .tabla-ranking tbody tr:hover { background: #f5faf5; }
    .top1 { background: #fffde7 !important; }
    .destacado { background: #e8f5e9 !important; font-weight: 600; }
    .posicion { font-weight: 800; color: #1a472a; font-size: 16px; width: 50px; }
    .puntos { font-weight: 700; color: #2d7a3a; font-size: 16px; }
    .link-usuario { color: #1a472a; text-decoration: none; font-weight: 600; }
    .link-usuario:hover { text-decoration: underline; color: #2d7a3a; }
    .link-clan {
      color: #1565c0; text-decoration: none; font-weight: 500; cursor: pointer;
      background: #e3f2fd; padding: 2px 10px; border-radius: 12px; font-size: 13px;
    }
    .link-clan:hover { background: #bbdefb; }
    .sin-clan { color: #ccc; }
    .vacio { text-align: center; color: #999; padding: 40px !important; }

    .seccion-vacia {
      text-align: center; padding: 60px 20px; background: #fff;
      border-radius: 16px; box-shadow: 0 2px 16px rgba(0,0,0,0.08);
      margin-bottom: 24px;
    }
    .seccion-icon { font-size: 56px; display: block; margin-bottom: 12px; }
    .seccion-vacia h2 { font-size: 24px; font-weight: 700; color: #1a472a; margin: 0 0 8px 0; }
    .seccion-vacia p { color: #888; font-size: 15px; margin: 0 0 32px 0; }

    .partidos-placeholder {
      display: flex; flex-direction: column; gap: 12px; max-width: 500px; margin: 0 auto;
    }
    .partido-placeholder {
      display: flex; justify-content: space-between; align-items: center;
      padding: 16px 24px; background: #f5faf5; border-radius: 12px;
      border: 1px dashed #2d7a3a; font-size: 14px; font-weight: 600; color: #444;
    }
    .vs { color: #2d7a3a; font-weight: 800; font-size: 16px; }

    .perfil-card {
      background: #fff; border-radius: 16px; padding: 40px;
      text-align: center; box-shadow: 0 2px 16px rgba(0,0,0,0.08);
      margin-bottom: 24px;
    }
    .perfil-avatar { font-size: 64px; margin-bottom: 12px; }
    .perfil-card h2 { font-size: 24px; font-weight: 800; color: #1a472a; margin: 0; }
    .perfil-email { color: #888; font-size: 14px; margin: 4px 0 24px 0; }
    .perfil-stats { display: flex; justify-content: center; gap: 40px; margin-bottom: 24px; }
    .perfil-stat { display: flex; flex-direction: column; align-items: center; }
    .perfil-stat-valor { font-size: 28px; font-weight: 800; color: #2d7a3a; }
    .perfil-stat-label { font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; }
    .perfil-info { max-width: 300px; margin: 0 auto; text-align: left; }
    .perfil-info p { font-size: 14px; color: #444; margin: 4px 0; }
    .perfil-info strong { color: #1a472a; }

    @media (max-width: 640px) { .paneles { grid-template-columns: 1fr; } }
  `]
})
export class HomeComponent implements OnInit {
  private auth = inject(AuthService);
  private fechaService = inject(FechaService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  fechas: FechaResponse[] = [];
  seccion: 'ranking' | 'pronosticos' | 'perfil' | 'fechas' = 'ranking';
  ranking: RankingUsuario[] = [];
  clanes: string[] = [];
  ordenFechas: string = 'asc';
  orden = 'desc';
  clanSeleccionado = '';

  get puntero(): RankingUsuario | undefined {
    return this.ranking.length > 0 ? this.ranking[0] : undefined;
  }

  get miId(): number | null {
    const u = localStorage.getItem('usuario');
    if (!u) return null;
    try { return JSON.parse(u).id; } catch { return null; }
  }

  get misPuntos(): number {
    const u = this.ranking.find(r => r.id === this.miId);
    return u?.puntos ?? 0;
  }

  get misPronosticos(): number {
    const u = this.ranking.find(r => r.id === this.miId);
    return u?.pronosticos ?? 0;
  }

  protected userName = computed(() => {
    const u = localStorage.getItem('usuario');
    if (!u) return '';
    return JSON.parse(u).nombre || '';
  });

  protected apellido = computed(() => {
    const u = localStorage.getItem('usuario');
    if (!u) return '';
    return JSON.parse(u).apellido || '';
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

  protected miClan = computed(() => {
    const u = localStorage.getItem('usuario');
    if (!u) return null;
    return JSON.parse(u).clan || null;
  });

  ngOnInit(): void {
    this.cargarClanes();
    this.cargarRanking();
    this.cargarFechas();
  }

  cargarRanking(): void {
    const clan = this.clanSeleccionado || undefined;
    this.auth.getRanking(this.orden, clan).subscribe({
      next: (r) => this.ranking = r
    });
  }

  cargarClanes(): void {
    this.auth.getClanes().subscribe({
      next: (c) => this.clanes = c
    });
  }

  filtrarPorClan(clan: string): void {
    this.clanSeleccionado = clan;
    this.seccion = 'ranking';
    this.cargarRanking();
  }
  cargarFechas(): void {
    this.fechaService.listar(this.ordenFechas).subscribe({
      next: (data) => {
        this.fechas = data;
        this.cdr.detectChanges();
      }
    });
  }
  toggleOrdenFechas(): void {
    this.ordenFechas = this.ordenFechas === 'asc' ? 'desc' : 'asc';
    this.cargarFechas();
  }
  verPartidos(fecha: FechaResponse) {
      this.router.navigate(['/fechas', fecha.idFecha, 'partidos'], {
        state: { nombreFecha: fecha.nombreFecha }
      });
    }
}
