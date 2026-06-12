import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Equipo, EquipoCreateRequest, EquiposService } from './equipos.service';

@Component({
  selector: 'app-equipos',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './equipos.component.html',
  styleUrl: './equipos.component.css'
})
export class EquiposComponent implements OnInit {
  private readonly equiposService = inject(EquiposService);
  private readonly limiteEquipos = 32;

  equipos: Equipo[] = [];
  equipoSeleccionado: Equipo | null = null;
  busqueda = '';
  nuevoEquipo: EquipoCreateRequest = this.formularioVacio();
  loading = false;
  guardando = false;
  eliminandoId: number | null = null;
  error = '';
  mensaje = '';

  ngOnInit(): void {
    this.cargarEquipos();
  }

  get equiposFiltrados(): Equipo[] {
    const termino = this.busqueda.trim().toLowerCase();

    if (!termino) {
      return this.equipos;
    }

    return this.equipos.filter(equipo =>
      equipo.nombre_equipo.toLowerCase().includes(termino) ||
      equipo.nombre_corto.toLowerCase().includes(termino) ||
      (equipo.descripcion ?? '').toLowerCase().includes(termino)
    );
  }

  get equiposActivos(): Equipo[] {
    return this.equiposFiltrados.filter(equipo => equipo.estado_equipo);
  }

  get equiposInactivos(): Equipo[] {
    return this.equiposFiltrados.filter(equipo => !equipo.estado_equipo);
  }

  get limiteAlcanzado(): boolean {
    return this.equipos.length >= this.limiteEquipos;
  }

  get cuposDisponibles(): number {
    return Math.max(this.limiteEquipos - this.equipos.length, 0);
  }

  cargarEquipos(): void {
    this.loading = true;
    this.error = '';

    this.equiposService.listar().subscribe({
      next: equipos => {
        this.equipos = equipos;
        this.loading = false;

        if (this.equipoSeleccionado) {
          this.equipoSeleccionado = this.equipos.find(
            equipo => equipo.id_equipo === this.equipoSeleccionado?.id_equipo
          ) ?? null;
        }
      },
      error: err => {
        this.loading = false;
        this.error = this.obtenerError(err, 'No se pudieron cargar los equipos.');
      }
    });
  }

  buscar(): void {
    this.error = '';
    this.mensaje = '';
  }

  limpiarBusqueda(): void {
    this.busqueda = '';
    this.buscar();
  }

  seleccionarEquipo(equipo: Equipo): void {
    this.error = '';
    this.mensaje = '';
    this.equiposService.obtener(equipo.id_equipo).subscribe({
      next: detalle => this.equipoSeleccionado = detalle,
      error: err => this.error = this.obtenerError(err, 'No se pudo obtener el equipo.')
    });
  }

  crearEquipo(): void {
    if (this.guardando || this.limiteAlcanzado) return;

    this.guardando = true;
    this.error = '';
    this.mensaje = '';

    const request: EquipoCreateRequest = {
      nombre_equipo: this.nuevoEquipo.nombre_equipo.trim(),
      nombre_corto: this.nuevoEquipo.nombre_corto.trim().toUpperCase(),
      descripcion: this.nuevoEquipo.descripcion?.trim() || undefined
    };

    this.equiposService.crear(request).subscribe({
      next: equipo => {
        this.guardando = false;
        this.mensaje = 'Equipo creado correctamente.';
        this.nuevoEquipo = this.formularioVacio();
        this.cargarEquipos();
        this.equipoSeleccionado = equipo;
      },
      error: err => {
        this.guardando = false;
        this.error = this.obtenerError(err, 'No se pudo crear el equipo.');
      }
    });
  }

  eliminarEquipo(equipo: Equipo): void {
    if (this.eliminandoId || !equipo.estado_equipo) return;

    const confirmar = window.confirm(`Eliminar ${equipo.nombre_equipo}?`);
    if (!confirmar) return;

    this.eliminandoId = equipo.id_equipo;
    this.error = '';
    this.mensaje = '';

    this.equiposService.eliminar(equipo.id_equipo).subscribe({
      next: () => {
        this.eliminandoId = null;
        this.mensaje = 'Equipo marcado como inactivo.';
        this.cargarEquipos();
      },
      error: err => {
        this.eliminandoId = null;
        this.error = this.obtenerError(err, 'No se pudo eliminar el equipo.');
      }
    });
  }

  iniciales(equipo: Equipo): string {
    if (equipo.nombre_corto) {
      return equipo.nombre_corto.toUpperCase();
    }

    return equipo.nombre_equipo
      .split(' ')
      .filter(Boolean)
      .slice(0, 3)
      .map(parte => parte[0])
      .join('')
      .toUpperCase();
  }

  private formularioVacio(): EquipoCreateRequest {
    return {
      nombre_equipo: '',
      nombre_corto: '',
      descripcion: ''
    };
  }

  private obtenerError(err: unknown, fallback: string): string {
    if (typeof err === 'object' && err !== null && 'error' in err) {
      const response = (err as { error?: { message?: string; errors?: string[] } }).error;

      if (response?.errors?.length) {
        return response.errors.join(' ');
      }
      if (response?.message) {
        return response.message;
      }
    }

    return fallback;
  }
}
