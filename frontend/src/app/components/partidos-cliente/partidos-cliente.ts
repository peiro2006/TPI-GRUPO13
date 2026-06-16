import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { PartidoResponse, PartidoService } from '../../services/partido.service';

@Component({
  selector: 'app-partidos-cliente',
  imports: [RouterModule, DatePipe],
  templateUrl: './partidos-cliente.html',
  styleUrl: './partidos-cliente.css',
})
export class PartidosCliente implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly partidoService = inject(PartidoService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly fechaId = Number(this.route.snapshot.paramMap.get('id'));
  readonly nombreFecha = history.state.nombreFecha || '';

  partidos: PartidoResponse[] = [];
  error = '';

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
}
