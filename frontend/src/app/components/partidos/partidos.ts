import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Equipo, EquiposService } from '../../equipos/equipos.service';
import { PartidoResponse, PartidoService } from '../../services/partido.service';

@Component({
  selector: 'app-partidos',
  imports: [RouterModule, FormsModule],
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
}
