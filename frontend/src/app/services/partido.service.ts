import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PartidoResponse {
  idPartido: number;
  idFecha: number;
  fechaPartido: string;
  horaInicio: string | null;
  visitante: string;
  local: string;
  resultadoPartido: string;
  estadoPartido: string;
  golesLocal: number | null;
  golesVisitante: number | null;
}
export interface PartidoRequest {
  idFecha: number;
  fechaPartido: string;
  horaInicio: string | null;
  visitante: string;
  local: string;
}
export interface PartidoUpdateRequest {
  fechaPartido?: string;
  horaInicio?: string;
  resultadoPartido?: string;
  estadoPartido?: string;
}

export interface ResultadoRequest {
  golesLocal: number;
  golesVisitante: number;
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

  cargarResultado(id: number, datos: ResultadoRequest): Observable<PartidoResponse> {
    return this.http.put<PartidoResponse>(`${this.apiUrl}/${id}/resultado`, datos);
  }

  finalizar(id: number, datos: ResultadoRequest): Observable<PartidoResponse> {
    return this.http.put<PartidoResponse>(`${this.apiUrl}/${id}/finalizar`, datos);
  }
}
