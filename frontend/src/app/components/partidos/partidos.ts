import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-partidos',
  imports: [RouterModule],
  templateUrl: './partidos.html',
  styleUrl: './partidos.css',
})
export class PartidosComponent {
  private readonly route = inject(ActivatedRoute);
  readonly fechaId = this.route.snapshot.paramMap.get('id');
  readonly nombreFecha = history.state.nombreFecha || '';
}
