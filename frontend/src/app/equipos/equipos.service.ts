import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

export interface Equipo {
  id_equipo: number;
  nombre_equipo: string;
  descripcion: string | null;
  nombre_corto: string;
  estado_equipo: boolean;
}

export interface EquipoCreateRequest {
  nombre_equipo: string;
  descripcion?: string;
  nombre_corto: string;
}

interface BaseResponse<T> {
  data: T;
  message: string;
  errors: string[] | null;
  timestamp: string;
}

@Injectable({ providedIn: 'root' })
export class EquiposService {
  private readonly API_URL = 'http://localhost:8080/equipo';

  constructor(private http: HttpClient) {}

  listar(filtros?: {
    nombre_equipo?: string;
    descripcion_equipo?: string;
    nombre_corto?: string;
  }): Observable<Equipo[]> {
    let params = new HttpParams();

    if (filtros?.nombre_equipo) {
      params = params.set('nombre_equipo', filtros.nombre_equipo);
    }
    if (filtros?.descripcion_equipo) {
      params = params.set('descripcion_equipo', filtros.descripcion_equipo);
    }
    if (filtros?.nombre_corto) {
      params = params.set('nombre_corto', filtros.nombre_corto);
    }

    return this.http
      .get<BaseResponse<Equipo[]>>(this.API_URL, { params })

      .pipe(map(response => response.data ?? []));
  }

  obtener(id: number): Observable<Equipo> {
    return this.http
      .get<BaseResponse<Equipo>>(`${this.API_URL}/${id}`)
      .pipe(map(response => response.data));
  }

  crear(data: EquipoCreateRequest): Observable<Equipo> {
    return this.http
      .post<BaseResponse<Equipo>>(this.API_URL, data)
      .pipe(map(response => response.data));
  }

  eliminar(id: number): Observable<void> {
    return this.http
      .delete<BaseResponse<void>>(`${this.API_URL}/${id}`)
      .pipe(map(() => undefined));
  }
}
