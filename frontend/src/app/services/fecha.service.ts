import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FechaResponse {
  idFecha: number;
  nombreFecha: string;
  estadoFecha: string;
  inicioFecha: string | null;
  finFecha: string | null;
}

@Injectable({ providedIn: 'root' })
export class FechaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/fechas';


  listar(orden: string = 'asc'): Observable<FechaResponse[]> {
      return this.http.get<FechaResponse[]>(`${this.apiUrl}?orden=${orden}`);
  }

  actualizar(id: number, nombreFecha: string, inicioFecha: string | null, finFecha: string | null): Observable<FechaResponse> {
    return this.http.put<FechaResponse>(`${this.apiUrl}/${id}`, { nombreFecha, inicioFecha, finFecha });
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  crear(nombreFecha: string, inicioFecha: string | null, finFecha: string | null): Observable<FechaResponse> {
    return this.http.post<FechaResponse>(this.apiUrl, { nombreFecha, inicioFecha, finFecha });
  }
}
