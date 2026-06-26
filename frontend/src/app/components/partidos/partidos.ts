import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Equipo, EquiposService } from '../../equipos/equipos.service';
import { PartidoResponse, PartidoService } from '../../services/partido.service';

@Component({
  selector: 'app-partidos',
  imports: [RouterModule, FormsModule, DatePipe],
  templateUrl: './partidos.html',
  styleUrl: './partidos.css',
})
export class PartidosComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly partidoService = inject(PartidoService);
  private readonly equiposService = inject(EquiposService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly fechaId = Number(this.route.snapshot.paramMap.get('id'));
  readonly nombreFecha = history.state.nombreFecha || '';

  partidos: PartidoResponse[] = [];
  equipos: Equipo[] = [];
  guardando = false;
  error = '';

  nuevaFechaPartido = '';
  nuevaHoraInicio = '';
  nuevoLocal: number | null = null;
  nuevoVisitante: number | null = null;

  editandoId: number | null = null;
  fechaEditando = '';
  horaEditando = '';

  resultadoId: number | null = null;
  golesLocal = 0;
  golesVisitante = 0;
  guardandoResultado = false;

  ngOnInit() {
    this.cargarPartidos();
    this.cargarEquipos();
  }

  cargarPartidos() {
    this.partidoService.listarPorFecha(this.fechaId).subscribe({
      next: data => {
        this.partidos = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Error al cargar partidos';
        this.cdr.detectChanges();
      }
    });
  }

  cargarEquipos() {
    this.equiposService.listar().subscribe({
      next: data => {
        this.equipos = data.filter(e => e.estado_equipo);
        this.cdr.detectChanges();
      }
    });
  }

  crearPartido() {
    if (this.guardando) return;
    if (!this.nuevaFechaPartido || !this.nuevoLocal || !this.nuevoVisitante) {
      this.error = 'Completá todos los campos';
      return;
    }
    if (this.nuevoLocal === this.nuevoVisitante) {
      this.error = 'Local y visitante deben ser distintos';
      return;
    }

    this.guardando = true;
    this.error = '';

    this.partidoService.crear({
      idFecha: this.fechaId,
      fechaPartido: this.nuevaFechaPartido,
      horaInicio: this.nuevaHoraInicio || null,
      local: this.equipos.find(e => e.id_equipo === this.nuevoLocal)!.nombre_equipo,
      visitante: this.equipos.find(e => e.id_equipo === this.nuevoVisitante)!.nombre_equipo
    }).subscribe({
      next: () => {
        this.guardando = false;
        this.nuevaFechaPartido = '';
        this.nuevaHoraInicio = '';
        this.nuevoLocal = null;
        this.nuevoVisitante = null;
        this.cargarPartidos();
      },
      error: err => {
        this.guardando = false;
        this.error = err.error?.message || 'Error al crear partido';
        this.cdr.detectChanges();
      }
    });
  }

  empezarEditar(p: PartidoResponse) {
    this.editandoId = p.idPartido;
    this.fechaEditando = p.fechaPartido.substring(0, 10);
    this.horaEditando = p.horaInicio ? p.horaInicio.substring(0, 5) : '';
    this.error = '';
  }

  guardarEdicion(id: number) {
    if (!this.fechaEditando) return;
    this.partidoService.actualizar(id, {
      fechaPartido: this.fechaEditando,
      horaInicio: this.horaEditando || undefined
    }).subscribe({
      next: () => {
        this.editandoId = null;
        this.fechaEditando = '';
        this.cargarPartidos();
      },
      error: err => {
        this.error = err.error?.error || 'Error al actualizar partido';
        this.cdr.detectChanges();
      }
    });
  }

  cancelarEdicion() {
    this.editandoId = null;
    this.fechaEditando = '';
    this.horaEditando = '';
    this.error = '';
  }

  eliminar(id: number) {
    if (!confirm('¿Eliminar este partido?')) return;
    this.partidoService.eliminar(id).subscribe({
      next: () => this.cargarPartidos(),
      error: err => {
        this.error = err.error?.error || 'Error al eliminar partido';
        this.cdr.detectChanges();
      }
    });
  }

  get esAdmin(): boolean {
    const u = localStorage.getItem('usuario');
    if (!u) return false;
    try { return JSON.parse(u).rol === 'ADMIN'; } catch { return false; }
  }

  empezarResultado(p: PartidoResponse) {
    this.resultadoId = p.idPartido;
    this.golesLocal = p.golesLocal ?? 0;
    this.golesVisitante = p.golesVisitante ?? 0;
    this.error = '';
  }

  guardarResultado(id: number) {
    if (this.guardandoResultado) return;
    this.guardandoResultado = true;
    this.error = '';

    this.partidoService.cargarResultado(id, {
      golesLocal: this.golesLocal,
      golesVisitante: this.golesVisitante
    }).subscribe({
      next: () => {
        this.resultadoId = null;
        this.guardandoResultado = false;
        this.golesLocal = 0;
        this.golesVisitante = 0;
        this.cargarPartidos();
      },
      error: err => {
        this.guardandoResultado = false;
        this.error = err.error?.error || 'Error al cargar resultado';
        this.cdr.detectChanges();
      }
    });
  }

  cancelarResultado() {
    this.resultadoId = null;
    this.golesLocal = 0;
    this.golesVisitante = 0;
    this.error = '';
  }

  iniciandoId: number | null = null;

  iniciarPartido(id: number) {
    this.iniciandoId = id;
    this.error = '';
    this.partidoService.iniciar(id).subscribe({
      next: () => {
        this.iniciandoId = null;
        this.cargarPartidos();
      },
      error: err => {
        this.iniciandoId = null;
        this.error = err.error?.error || 'Error al iniciar partido';
        this.cdr.detectChanges();
      }
    });
  }

  finalizarId: number | null = null;
  guardandoFinal = false;

  empezarFinalizar(p: PartidoResponse) {
    this.finalizarId = p.idPartido;
    this.error = '';
  }

  confirmarFinalizar(id: number) {
    if (this.guardandoFinal) return;
    this.guardandoFinal = true;
    this.error = '';

    this.partidoService.finalizar(id).subscribe({
      next: () => {
        this.finalizarId = null;
        this.guardandoFinal = false;
        this.cargarPartidos();
      },
      error: err => {
        this.guardandoFinal = false;
        this.error = err.error?.error || 'Error al finalizar partido';
        this.cdr.detectChanges();
      }
    });
  }

  cancelarFinalizar() {
    this.finalizarId = null;
    this.error = '';
  }
}
