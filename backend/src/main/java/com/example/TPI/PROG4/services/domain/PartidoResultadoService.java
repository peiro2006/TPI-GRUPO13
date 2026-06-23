package com.example.TPI.PROG4.services.domain;

import com.example.TPI.PROG4.Interfaces.IPartidoResultadoService;
import com.example.TPI.PROG4.dtos.request.ResultadoRequestDto;
import com.example.TPI.PROG4.dtos.response.PartidoCreateResDto;
import com.example.TPI.PROG4.mappers.PartidoMapper;
import com.example.TPI.PROG4.models.Partido;
import com.example.TPI.PROG4.repositories.PartidosRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@AllArgsConstructor
public class PartidoResultadoService implements IPartidoResultadoService {

    private final PartidosRepository partidosRepository;

    @Override
    public PartidoCreateResDto execute(Long id, ResultadoRequestDto request) {
        Partido partido = partidosRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Partido no encontrado"));

        if (!"En juego".equals(partido.getEstadoPartido())) {
            throw new RuntimeException("Solo se puede cargar el resultado de un partido en estado 'En juego'");
        }

        if (partido.getHoraInicio() != null && partido.getFechaPartido() != null) {
            LocalDateTime inicio = LocalDateTime.of(partido.getFechaPartido(), partido.getHoraInicio());
            if (LocalDateTime.now().isBefore(inicio.minusMinutes(30))) {
                throw new RuntimeException("No se puede cargar el resultado antes de los 30 minutos previos al inicio del partido");
            }
        }

        Partido updated = PartidoMapper.applyResultado(partido, request);
        return PartidoMapper.toResponseDto(partidosRepository.save(updated));
    }
}
