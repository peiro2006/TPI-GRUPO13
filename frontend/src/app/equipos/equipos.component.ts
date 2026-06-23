import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
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
  private readonly cdr = inject(ChangeDetectorRef);
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
  readonly flagUrl = 'https://flagcdn.com/24x18';
  readonly paises = [
    { codigo: 'ar', nombre: 'Argentina' },
    { codigo: 'bo', nombre: 'Bolivia' },
    { codigo: 'br', nombre: 'Brasil' },
    { codigo: 'cl', nombre: 'Chile' },
    { codigo: 'co', nombre: 'Colombia' },
    { codigo: 'cr', nombre: 'Costa Rica' },
    { codigo: 'cu', nombre: 'Cuba' },
    { codigo: 'do', nombre: 'Rep. Dominicana' },
    { codigo: 'ec', nombre: 'Ecuador' },
    { codigo: 'sv', nombre: 'El Salvador' },
    { codigo: 'gt', nombre: 'Guatemala' },
    { codigo: 'hn', nombre: 'Honduras' },
    { codigo: 'mx', nombre: 'México' },
    { codigo: 'ni', nombre: 'Nicaragua' },
    { codigo: 'pa', nombre: 'Panamá' },
    { codigo: 'py', nombre: 'Paraguay' },
    { codigo: 'pe', nombre: 'Perú' },
    { codigo: 'uy', nombre: 'Uruguay' },
    { codigo: 've', nombre: 'Venezuela' },
    { codigo: 'us', nombre: 'Estados Unidos' },
    { codigo: 'ca', nombre: 'Canadá' },
    { codigo: 'es', nombre: 'España' },
    { codigo: 'fr', nombre: 'Francia' },
    { codigo: 'de', nombre: 'Alemania' },
    { codigo: 'it', nombre: 'Italia' },
    { codigo: 'pt', nombre: 'Portugal' },
    { codigo: 'gb', nombre: 'Reino Unido' },
    { codigo: 'nl', nombre: 'Países Bajos' },
    { codigo: 'be', nombre: 'Bélgica' },
    { codigo: 'ch', nombre: 'Suiza' },
    { codigo: 'se', nombre: 'Suecia' },
    { codigo: 'no', nombre: 'Noruega' },
    { codigo: 'dk', nombre: 'Dinamarca' },
    { codigo: 'pl', nombre: 'Polonia' },
    { codigo: 'ua', nombre: 'Ucrania' },
    { codigo: 'hr', nombre: 'Croacia' },
    { codigo: 'rs', nombre: 'Serbia' },
    { codigo: 'gr', nombre: 'Grecia' },
    { codigo: 'tr', nombre: 'Turquía' },
    { codigo: 'ru', nombre: 'Rusia' },
    { codigo: 'jp', nombre: 'Japón' },
    { codigo: 'kr', nombre: 'Corea del Sur' },
    { codigo: 'sa', nombre: 'Arabia Saudita' },
    { codigo: 'ir', nombre: 'Irán' },
    { codigo: 'au', nombre: 'Australia' },
    { codigo: 'nz', nombre: 'Nueva Zelanda' },
    { codigo: 'ma', nombre: 'Marruecos' },
    { codigo: 'dz', nombre: 'Argelia' },
    { codigo: 'tn', nombre: 'Túnez' },
    { codigo: 'eg', nombre: 'Egipto' },
    { codigo: 'ng', nombre: 'Nigeria' },
    { codigo: 'cm', nombre: 'Camerún' },
    { codigo: 'gh', nombre: 'Ghana' },
    { codigo: 'sn', nombre: 'Senegal' },
    { codigo: 'ci', nombre: 'Costa de Marfil' },
    { codigo: 'ml', nombre: 'Malí' },
  ];
  mostrarBanderas = false;

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
    return this.equiposActivos.length >= this.limiteEquipos;
  }

  get cuposDisponibles(): number {
    return Math.max(this.limiteEquipos - this.equiposActivos.length, 0);
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

        this.cdr.detectChanges();
      },
      error: err => {
        this.loading = false;
        this.error = this.obtenerError(err, 'No se pudieron cargar los equipos.');
        this.cdr.detectChanges();
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
      next: detalle => {
        this.equipoSeleccionado = detalle;
        this.cdr.detectChanges();
      },
      error: err => {
        this.error = this.obtenerError(err, 'No se pudo obtener el equipo.');
        this.cdr.detectChanges();
      }
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
      descripcion: this.nuevoEquipo.descripcion?.trim() || undefined,
      bandera_codigo: this.nuevoEquipo.bandera_codigo?.trim().toLowerCase() || undefined
    };

    this.equiposService.crear(request).subscribe({
      next: equipo => {
        this.guardando = false;
        this.mensaje = 'Equipo creado correctamente.';
        this.nuevoEquipo = this.formularioVacio();
        this.cargarEquipos();
        this.equipoSeleccionado = equipo;
        this.cdr.detectChanges();
      },
      error: err => {
        this.guardando = false;
        this.error = this.obtenerError(err, 'No se pudo crear el equipo.');
        this.cdr.detectChanges();
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
        this.cdr.detectChanges();
      },
      error: err => {
        this.eliminandoId = null;
        this.error = this.obtenerError(err, 'No se pudo eliminar el equipo.');
        this.cdr.detectChanges();
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

  seleccionarBandera(codigo: string): void {
    this.nuevoEquipo.bandera_codigo = codigo;
    this.mostrarBanderas = false;
  }

  flagSrc(codigo: string | null | undefined): string {
    return codigo ? `${this.flagUrl}/${codigo.toLowerCase()}.png` : '';
  }

  private formularioVacio(): EquipoCreateRequest {
    return {
      nombre_equipo: '',
      nombre_corto: '',
      descripcion: '',
      bandera_codigo: ''
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
