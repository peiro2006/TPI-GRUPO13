import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

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

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api/auth';

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
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private readonly RANKING_URL = 'http://localhost:8080/api/ranking';

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
}
