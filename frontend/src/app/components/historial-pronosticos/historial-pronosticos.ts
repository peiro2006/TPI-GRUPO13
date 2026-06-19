import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthService, PronosticoPartido } from '../../auth.service';

type FiltroEstado = 'todos' | 'Pendiente' | 'En Juego' | 'Finalizado';

interface GrupoPronosticos {
  estado: string;
  pronosticos: PronosticoPartido[];
}

@Component({
  selector: 'app-historial-pronosticos',
  imports: [RouterModule, DatePipe],
  templateUrl: './historial-pronosticos.html',
  styleUrl: './historial-pronosticos.css',
})
export class HistorialPronosticos implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);

  todosPronosticos: PronosticoPartido[] = [];
  grupos: GrupoPronosticos[] = [];
  filtroSeleccionado: FiltroEstado = 'todos';
  error = '';
  loading = true;

  ngOnInit() {
    this.cargarHistorial();
  }

  cargarHistorial() {
    this.loading = true;
    this.authService.getMisPronosticos().subscribe({
      next: (data: PronosticoPartido[]) => {
        this.todosPronosticos = data;
        this.aplicarFiltro();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Error al cargar el historial de pronósticos';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  seleccionarFiltro(filtro: FiltroEstado) {
    this.filtroSeleccionado = filtro;
    this.aplicarFiltro();
  }

  mapearEstado(estado: string): FiltroEstado {
    if (estado === 'Por jugarse') return 'Pendiente';
    return estado as FiltroEstado;
  }

  private aplicarFiltro() {
    let filtrados = this.todosPronosticos;

    if (this.filtroSeleccionado !== 'todos') {
      filtrados = this.todosPronosticos.filter(p =>
        this.mapearEstado(p.estadoPartido) === this.filtroSeleccionado
      );
    }

    this.grupos = this.agruparPorEstado(filtrados);
  }

  private agruparPorEstado(pronosticos: PronosticoPartido[]): GrupoPronosticos[] {
    const map = new Map<string, PronosticoPartido[]>();

    for (const p of pronosticos) {
      const estado = this.mapearEstado(p.estadoPartido);
      if (!map.has(estado)) map.set(estado, []);
      map.get(estado)!.push(p);
    }

    const ordenEstados: FiltroEstado[] = ['Pendiente', 'En Juego', 'Finalizado'];
    return ordenEstados
      .filter(e => map.has(e))
      .map(estado => ({
        estado,
        pronosticos: map.get(estado)!
      }));
  }
}
