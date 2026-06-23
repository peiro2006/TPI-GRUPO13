package com.example.TPI.PROG4.services.domain;

import com.example.TPI.PROG4.Interfaces.IPartidoFinalizarService;
import com.example.TPI.PROG4.dtos.request.ResultadoRequestDto;
import com.example.TPI.PROG4.dtos.response.PartidoCreateResDto;
import com.example.TPI.PROG4.mappers.PartidoMapper;
import com.example.TPI.PROG4.models.Partido;
import com.example.TPI.PROG4.repositories.PartidosRepository;
import com.example.TPI.PROG4.services.FechaService;
import com.example.TPI.PROG4.services.PronosticoPuntosService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@AllArgsConstructor
public class PartidoFinalizarService implements IPartidoFinalizarService {

    private final PartidosRepository partidosRepository;
    private final PronosticoPuntosService pronosticoPuntosService;
    private final FechaService fechaService;

    @Override
    @Transactional
    public PartidoCreateResDto execute(Long id, ResultadoRequestDto request) {
        Partido partido = partidosRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Partido no encontrado"));

        if ("Finalizado".equals(partido.getEstadoPartido())) {
            throw new RuntimeException("El partido ya está finalizado");
        }

        if (partido.getHoraInicio() != null && partido.getFechaPartido() != null) {
            LocalDateTime inicio = LocalDateTime.of(partido.getFechaPartido(), partido.getHoraInicio());
            if (LocalDateTime.now().isBefore(inicio.minusMinutes(30))) {
                throw new RuntimeException("No se puede finalizar el partido antes de los 30 minutos previos al inicio del partido");
            }
        }

        Partido updated = partido.toBuilder()
                .golesLocal(request.golesLocal())
                .golesVisitante(request.golesVisitante())
                .resultadoPartido(request.golesLocal() + " - " + request.golesVisitante())
                .estadoPartido("Finalizado")
                .build();

        Partido saved = partidosRepository.save(updated);
        pronosticoPuntosService.calcularPuntos(saved);
        fechaService.actualizarEstadoFecha(saved.getFecha());
        return PartidoMapper.toResponseDto(saved);
    }
}
