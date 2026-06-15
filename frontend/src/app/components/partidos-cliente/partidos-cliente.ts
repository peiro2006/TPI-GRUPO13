import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-partidos-cliente',
  imports: [RouterModule],
  templateUrl: './partidos-cliente.html',
  styleUrl: './partidos-cliente.css',
})
export class PartidosCliente {
  private readonly route = inject(ActivatedRoute);
  readonly fechaId = this.route.snapshot.paramMap.get('id');
  readonly nombreFecha = history.state.nombreFecha || '';
}
