import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PartidoResponse {
  idPartido: number;
  idFecha: number;
  fechaPartido: string;
  visitante: string;
  local: string;
  resultadoPartido: string;
  estadoPartido: string;
}
export interface PartidoRequest {
  idFecha: number;
  fechaPartido: string;
  visitante: string;
  local: string;
}
export interface PartidoUpdateRequest {
  fechaPartido?: string;
  resultadoPartido?: string;
  estadoPartido?: string;
}

@Injectable({ providedIn: 'root' })
export class PartidoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/partidos';

  listar(): Observable<PartidoResponse[]> {
    return this.http.get<PartidoResponse[]>(this.apiUrl);
  }

  listarPorFecha(fechaId: number): Observable<PartidoResponse[]> {
    return this.http.get<PartidoResponse[]>(`${this.apiUrl}/fecha/${fechaId}`);
  }

  crear(datos: PartidoRequest): Observable<PartidoResponse> {
    return this.http.post<PartidoResponse>(this.apiUrl, datos);
  }

  actualizar(id: number, datos: PartidoUpdateRequest): Observable<PartidoResponse> {
    return this.http.patch<PartidoResponse>(`${this.apiUrl}/${id}`, datos);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
