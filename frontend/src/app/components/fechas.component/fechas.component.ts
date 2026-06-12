import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FechaService, FechaResponse } from '../../services/fecha.service';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fechas',
  imports: [DatePipe, FormsModule],
  templateUrl: './fechas.component.html',
  styleUrl: './fechas.component.css',
})
export class FechasComponent implements OnInit {
  private readonly fechaService = inject(FechaService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);

  fechas: FechaResponse[] = [];
  editandoId: number | null = null;
  nombreEditando = '';
  mensajeError = '';
  mostrarFormulario = false;
  nuevaFechaNombre = '';

  ngOnInit() {
    this.cargarFechas();
  }

  cargarFechas() {
    this.fechaService.listar().subscribe({
      next: data => {
        this.fechas = data;
        this.cdr.detectChanges();
      },
      error: () => this.mensajeError = 'Error al cargar fechas'
    });
  }

  mostrarAgregar() {
    this.mostrarFormulario = true;
    this.nuevaFechaNombre = '';
    this.mensajeError = '';
  }

  agregarFecha() {
    if (!this.nuevaFechaNombre.trim()) return;
    this.fechaService.crear(this.nuevaFechaNombre.trim()).subscribe({
      next: () => {
        this.mostrarFormulario = false;
        this.nuevaFechaNombre = '';
        this.cargarFechas();
      },
      error: err => {
        this.mensajeError = typeof err.error === 'string' ? err.error : 'Error al crear fecha';
        this.cdr.detectChanges();
      }
    });
  }

  verPartidos(fecha: FechaResponse) {
    this.router.navigate(['/admin/fechas', fecha.idFecha, 'partidos'], {
      state: { nombreFecha: fecha.nombreFecha }
    });
  }

  cancelarAgregar() {
    this.mostrarFormulario = false;
    this.nuevaFechaNombre = '';
    this.mensajeError = '';
  }

  empezarEditar(fecha: FechaResponse) {
    this.editandoId = fecha.idFecha;
    this.nombreEditando = fecha.nombreFecha;
    this.mensajeError = '';
    this.cdr.detectChanges();
  }

  guardarEdicion(id: number) {
    if (!this.nombreEditando.trim()) return;
    this.fechaService.actualizar(id, this.nombreEditando.trim()).subscribe({
      next: () => {
        this.editandoId = null;
        this.nombreEditando = '';
        this.cargarFechas();
      },
      error: err => {
        this.mensajeError = typeof err.error === 'string' ? err.error : 'Error al actualizar';
        this.cdr.detectChanges();
      }
    });
  }

  cancelarEdicion() {
    this.editandoId = null;
    this.nombreEditando = '';
    this.mensajeError = '';
  }

  eliminar(id: number) {
    if (!confirm('¿Eliminar esta fecha?')) return;
    this.fechaService.eliminar(id).subscribe({
      next: () => this.cargarFechas(),
      error: err => {
        this.mensajeError = typeof err.error === 'string' ? err.error : 'Error al eliminar';
        this.cdr.detectChanges();
      }
    });
  }
}
