package com.example.TPI.PROG4.services;

import com.example.TPI.PROG4.models.Fecha;
import com.example.TPI.PROG4.repositories.FechaRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FechaService {

    private final FechaRepository fechaRepository;

    public Fecha crearFecha(String nombreFecha, LocalDate inicioFecha, LocalDate finFecha) {
        String nombreNormalizado = nombreFecha.trim();

        if (fechaRepository.existsByNombreFecha(nombreNormalizado)) {
            throw new RuntimeException("Ya existe una fecha con ese nombre");
        }

        Fecha fecha = new Fecha();
        fecha.setNombreFecha(nombreNormalizado);
        fecha.setEstadoFecha("Programada");
        fecha.setInicioFecha(inicioFecha);
        fecha.setFinFecha(finFecha);

        return fechaRepository.save(fecha);
    }

    public List<Fecha> listarFechas(String orden) {
        if ("desc".equalsIgnoreCase(orden)) {
            return fechaRepository.findAllByOrderByInicioFechaDesc();
        }
        return fechaRepository.findAllByOrderByInicioFechaAsc();
    }
    @Transactional
    public Fecha actualizarFecha(Long id, String nuevoNombre, LocalDate inicioFecha, LocalDate finFecha) {
        Fecha fecha = fechaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fecha no encontrada"));

        if (!fecha.getPartidos().isEmpty()) {
            throw new RuntimeException("No se puede modificar una fecha con partidos asociados");
        }

        String nombreNormalizado = nuevoNombre.trim();

        if (!fecha.getNombreFecha().equals(nombreNormalizado)
                && fechaRepository.existsByNombreFecha(nombreNormalizado)) {
            throw new RuntimeException("Ya existe una fecha con ese nombre");
        }

        fecha.setNombreFecha(nombreNormalizado);
        fecha.setInicioFecha(inicioFecha);
        fecha.setFinFecha(finFecha);
        return fechaRepository.save(fecha);
    }
    @Transactional
    public void eliminarFecha(Long id) {
        Fecha fecha = fechaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fecha no encontrada"));

        if (!fecha.getPartidos().isEmpty()) {
            throw new RuntimeException("No se puede eliminar una fecha con partidos asociados");
        }

        fechaRepository.delete(fecha);
    }
}