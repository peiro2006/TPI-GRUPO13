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
  nuevoLocal: number | null = null;
  nuevoVisitante: number | null = null;

  editandoId: number | null = null;
  editandoResultadoId: number | null = null;
  resultadoEditando = '';
  fechaEditando = '';

  ngOnInit() {
    this.cargarPartidos();
    this.cargarEquipos();
  }

  cargarPartidos() {
    this.partidoService.listarPorFecha(this.fechaId).subscribe({
      next: data => {
        this.partidos = data;
        this.cdr.detectChanges();
        this.editandoId = null;
        this.editandoResultadoId = null;
      },
      error: () => {
        this.error = 'Error al cargar partidos';
        this.cdr.detectChanges();
        this.editandoId = null;
        this.editandoResultadoId = null;
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
      local: this.equipos.find(e => e.id_equipo === this.nuevoLocal)!.nombre_equipo,
      visitante: this.equipos.find(e => e.id_equipo === this.nuevoVisitante)!.nombre_equipo
    }).subscribe({
      next: () => {
        this.guardando = false;
        this.nuevaFechaPartido = '';
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
    this.error = '';
  }

  guardarEdicion(id: number) {
    if (!this.fechaEditando) return;
    this.partidoService.actualizar(id, { fechaPartido: this.fechaEditando }).subscribe({
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
    this.error = '';
  }
  iniciarPartido(id: number) {
    this.partidoService.actualizar(id, { estadoPartido: 'En juego' }).subscribe({
      next: () => this.cargarPartidos(),
      error: err => {
        this.error = err.error?.error || 'Error al iniciar partido';
        this.cdr.detectChanges();
      }
    });
  }

  empezarFinalizar(p: PartidoResponse) {
    this.editandoResultadoId = p.idPartido;
    this.resultadoEditando = '';
    this.error = '';
  }

  finalizarPartido(id: number) {
    if (!this.resultadoEditando.trim()) {
      this.error = 'Ingresá el resultado';
      return;
    }
    this.partidoService.actualizar(id, {
      resultadoPartido: this.resultadoEditando.trim()
    }).subscribe({
      next: () => {
        this.editandoResultadoId = null;
        this.resultadoEditando = '';
        this.cargarPartidos();
      },
      error: err => {
        this.error = err.error?.error || 'Error al finalizar partido';
        this.cdr.detectChanges();
      }
    });
  }

  cancelarFinalizar() {
    this.editandoResultadoId = null;
    this.resultadoEditando = '';
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
}
