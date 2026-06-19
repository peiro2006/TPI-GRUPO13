import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { PartidoResponse, PartidoService } from '../../services/partido.service';
import { AuthService, PronosticoComunidad } from '../../auth.service';

@Component({
  selector: 'app-partidos-cliente',
  imports: [RouterModule, DatePipe],
  templateUrl: './partidos-cliente.html',
  styleUrl: './partidos-cliente.css',
})
export class PartidosCliente implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly partidoService = inject(PartidoService);
  private readonly authService = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly fechaId = Number(this.route.snapshot.paramMap.get('id'));
  readonly nombreFecha = history.state.nombreFecha || '';

  partidos: PartidoResponse[] = [];
  error = '';

  comunidadMap: Record<number, PronosticoComunidad[]> = {};
  comunidadCargando: Record<number, boolean> = {};
  comunidadError: Record<number, string> = {};
  comunidadAbierto: Record<number, boolean> = {};

  ngOnInit() {
    this.cargarPartidos();
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

  toggleComunidad(partidoId: number) {
    if (this.comunidadAbierto[partidoId]) {
      this.comunidadAbierto[partidoId] = false;
      this.cdr.detectChanges();
      return;
    }

    this.comunidadAbierto[partidoId] = true;
    if (this.comunidadMap[partidoId]) {
      this.cdr.detectChanges();
      return;
    }

    this.comunidadCargando[partidoId] = true;
    this.comunidadError[partidoId] = '';
    this.cdr.detectChanges();

    this.authService.getPronosticosComunidad(partidoId).subscribe({
      next: data => {
        this.comunidadMap[partidoId] = data;
        this.comunidadCargando[partidoId] = false;
        this.cdr.detectChanges();
      },
      error: err => {
        this.comunidadMap[partidoId] = [];
        this.comunidadCargando[partidoId] = false;
        this.comunidadError[partidoId] = typeof err.error === 'string' ? err.error : 'Error al cargar pronósticos';
        this.cdr.detectChanges();
      }
    });
  }
}
