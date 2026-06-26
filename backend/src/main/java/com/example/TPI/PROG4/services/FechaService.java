package com.example.TPI.PROG4.services;

import com.example.TPI.PROG4.models.Fecha;
import com.example.TPI.PROG4.models.Partido;
import com.example.TPI.PROG4.repositories.FechaRepository;
import com.example.TPI.PROG4.repositories.PartidosRepository;
import com.example.TPI.PROG4.repositories.PronosticoRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@AllArgsConstructor
public class FechaService {

    private final FechaRepository fechaRepository;
    private final PartidosRepository partidoRepository;
    private final PronosticoRepository pronosticoRepository;

    public void actualizarEstadoFecha(Fecha fecha) {
        List<Partido> partidos = fecha.getPartidos();

        if (partidos.isEmpty()) {
            fecha.setEstadoFecha("Programada");
            return;
        }

        boolean todosFinalizados = partidos.stream()
                .allMatch(p -> "Finalizado".equals(p.getEstadoPartido()));
        boolean algunoEnJuego = partidos.stream()
                .anyMatch(p -> "En juego".equals(p.getEstadoPartido()));

        if (todosFinalizados) {
            fecha.setEstadoFecha("Finalizado");
        } else if (algunoEnJuego) {
            fecha.setEstadoFecha("En juego");
        } else {
            fecha.setEstadoFecha("Programada");
        }

        fechaRepository.save(fecha);
    }
    public Fecha crearFecha(String nombreFecha, LocalDate inicioFecha, LocalDate finFecha) {
        String nombreNormalizado = nombreFecha.trim();

        if (fechaRepository.existsByNombreFecha(nombreNormalizado)) {
            throw new RuntimeException("Ya existe una fecha con ese nombre");
        }
        if (inicioFecha != null && finFecha != null && finFecha.isBefore(inicioFecha)) {
            throw new RuntimeException("La fecha de fin no puede ser anterior a la fecha de inicio");
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

        if (!"Programada".equals(fecha.getEstadoFecha())) {
            throw new RuntimeException("Solo se puede modificar una fecha en estado 'Programada'");
        }

        if (!fecha.getPartidos().isEmpty()) {
            throw new RuntimeException("No se puede modificar una fecha con partidos asociados");
        }

        if (inicioFecha != null && finFecha != null && finFecha.isBefore(inicioFecha)) {
            throw new RuntimeException("La fecha de fin no puede ser anterior a la fecha de inicio");
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

        if (!"Programada".equals(fecha.getEstadoFecha())) {
            throw new RuntimeException("Solo se puede eliminar una fecha en estado 'Programada'");
        }

        for (Partido partido : fecha.getPartidos()) {
            pronosticoRepository.deleteByPartido_IdPartido(partido.getIdPartido());
            partidoRepository.delete(partido);
        }

        fechaRepository.delete(fecha);
    }
}