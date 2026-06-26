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
  guardando = false;
  nuevaFechaNombre = '';
  nuevaFechaInicio = '';
  nuevaFechaFin = '';
  inicioEditando = '';
  finEditando = '';

  ngOnInit() {
    this.cargarFechas();
  }

  cargarFechas() {
    this.fechaService.listar().subscribe({
      next: data => {
        this.fechas = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.mensajeError = 'Error al cargar fechas';
        this.cdr.detectChanges();
      }
    });
  }

  mostrarAgregar() {
    this.mostrarFormulario = true;
    this.nuevaFechaNombre = '';
    this.nuevaFechaInicio = '';
    this.nuevaFechaFin = '';
    this.mensajeError = '';
  }

  agregarFecha() {
    if (!this.nuevaFechaNombre.trim()) return;
    if (this.nuevaFechaInicio && this.nuevaFechaFin && this.nuevaFechaFin < this.nuevaFechaInicio) {
      this.mensajeError = 'La fecha de fin no puede ser anterior a la fecha de inicio';
      return;
    }
    this.fechaService.crear(
      this.nuevaFechaNombre.trim(),
      this.nuevaFechaInicio || null,
      this.nuevaFechaFin || null).subscribe({
      next: () => {
        this.mostrarFormulario = false;
        this.nuevaFechaNombre = '';
        this.nuevaFechaInicio = '';
        this.nuevaFechaFin = '';
        this.cargarFechas();
      },
      error: err => {
        this.mensajeError = err.error?.message || err.error?.error || 'Error al crear fecha';
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
    this.nuevaFechaInicio = '';
    this.nuevaFechaFin = '';
  }

  empezarEditar(fecha: FechaResponse) {
    this.editandoId = fecha.idFecha;
    this.nombreEditando = fecha.nombreFecha;
    this.inicioEditando = fecha.inicioFecha ? fecha.inicioFecha.substring(0, 10) : '';
    this.finEditando = fecha.finFecha ? fecha.finFecha.substring(0, 10) : '';
    this.mensajeError = '';
    this.cdr.detectChanges();
  }

  guardarEdicion(id: number) {
    if (this.guardando || !this.nombreEditando.trim()) return;
    this.guardando = true;
    this.mensajeError = '';
    this.cdr.detectChanges();
    if (this.inicioEditando && this.finEditando && this.finEditando < this.inicioEditando) {
      this.mensajeError = 'La fecha de fin no puede ser anterior a la fecha de inicio';
      this.guardando = false;
      return;
    }
    this.fechaService.actualizar(id, this.nombreEditando.trim(), this.inicioEditando || null, this.finEditando || null).subscribe({
      next: () => {
        this.editandoId = null;
        this.nombreEditando = '';
        this.inicioEditando = '';
        this.finEditando = '';
        this.guardando = false;
        this.cargarFechas();
      },
      error: err => {
        this.guardando = false;
        this.mensajeError = err.error?.message || err.error?.error || 'Error al actualizar';
        this.cdr.detectChanges();
      }
    });
  }

  cancelarEdicion() {
    this.editandoId = null;
    this.nombreEditando = '';
    this.inicioEditando = '';
    this.finEditando = '';
    this.mensajeError = '';
  }

  eliminar(id: number) {
    if (!confirm('¿Eliminar esta fecha?')) return;
    this.fechaService.eliminar(id).subscribe({
      next: () => this.cargarFechas(),
      error: err => {
        this.mensajeError = err.error?.message || err.error?.error || 'Error al eliminar';
        this.cdr.detectChanges();
      }
    });
  }
}
