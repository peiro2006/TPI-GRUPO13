import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface JwtPayload {
  exp?: number;
}

export interface RegisterRequest {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  clan?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  id: number;
  token: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  clan: string | null;
}

export interface RankingUsuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  clan: string | null;
  puntos: number;
  pronosticos: number;
  posicion?: number;
}

export interface PronosticoPartido {
  id: number | null;
  partidoId: number;
  local: string;
  visitante: string;
  fechaPartido: string;
  horaPartido: string;
  estadoPartido: string;
  golesLocal: number | null;
  golesVisitante: number | null;
  editable: boolean;
}

export interface PronosticoRequest {
  golesLocal: number;
  golesVisitante: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api/auth';
  private readonly RANKING_URL = 'http://localhost:8080/api/ranking';
  private readonly PRONOSTICO_URL = 'http://localhost:8080/api/pronosticos';

  constructor(private http: HttpClient) {}

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, data).pipe(
      tap(res => this.saveSession(res))
    );
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, data).pipe(
      tap(res => this.saveSession(res))
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    if (this.isTokenExpired(token)) {
      this.logout();
      return false;
    }

    return true;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isTokenExpired(token: string): boolean {
    const expiration = this.getTokenExpiration(token);
    if (!expiration) return true;

    return Date.now() >= expiration * 1000;
  }

  getRanking(orden: string = 'desc', clan?: string): Observable<RankingUsuario[]> {
    let params = `?orden=${orden}`;
    if (clan) params += `&clan=${encodeURIComponent(clan)}`;
    return this.http.get<RankingUsuario[]>(`${this.RANKING_URL}${params}`);
  }

  getClanes(): Observable<string[]> {
    return this.http.get<string[]>(`${this.RANKING_URL}/clanes`);
  }

  getPerfil(id: number): Observable<RankingUsuario> {
    return this.http.get<RankingUsuario>(`${this.RANKING_URL}/usuario/${id}`);
  }

  getPronosticosProximos(): Observable<PronosticoPartido[]> {
    return this.http.get<PronosticoPartido[]>(`${this.PRONOSTICO_URL}/proximos`);
  }

  guardarPronostico(partidoId: number, data: PronosticoRequest): Observable<PronosticoPartido> {
    return this.http.put<PronosticoPartido>(`${this.PRONOSTICO_URL}/partido/${partidoId}`, data);
  }

  private saveSession(res: AuthResponse): void {
    localStorage.setItem('token', res.token);
    localStorage.setItem('usuario', JSON.stringify({
      id: res.id,
      nombre: res.nombre,
      apellido: res.apellido,
      email: res.email,
      rol: res.rol,
      clan: res.clan
    }));
  }

  private getTokenExpiration(token: string): number | null {
    const payload = this.decodeJwtPayload(token);
    return typeof payload.exp === 'number' ? payload.exp : null;
  }

  private decodeJwtPayload(token: string): JwtPayload {
    try {
      const payload = token.split('.')[1];
      if (!payload) return {};

      const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
      const padded = normalized.padEnd(
        normalized.length + (4 - (normalized.length % 4)) % 4,
        '='
      );
      const json = decodeURIComponent(
        Array.from(atob(padded), char =>
          `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`
        ).join('')
      );

      return JSON.parse(json) as JwtPayload;
    } catch {
      return {};
    }
  }
}
