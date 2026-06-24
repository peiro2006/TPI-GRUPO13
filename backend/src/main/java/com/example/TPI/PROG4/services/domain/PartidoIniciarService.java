package com.example.TPI.PROG4.services.domain;

import com.example.TPI.PROG4.Interfaces.IPartidoIniciarService;
import com.example.TPI.PROG4.dtos.response.PartidoCreateResDto;
import com.example.TPI.PROG4.mappers.PartidoMapper;
import com.example.TPI.PROG4.models.Partido;
import com.example.TPI.PROG4.repositories.PartidosRepository;
import com.example.TPI.PROG4.services.FechaService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class PartidoIniciarService implements IPartidoIniciarService {

    private final PartidosRepository partidosRepository;
    private final FechaService fechaService;

    @Override
    @Transactional
    public PartidoCreateResDto execute(Long id) {
        Partido partido = partidosRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Partido no encontrado"));

        if (!"Por jugarse".equals(partido.getEstadoPartido())) {
            throw new RuntimeException("Solo se puede iniciar un partido en estado 'Por jugarse'");
        }

        Partido updated = partido.toBuilder()
                .estadoPartido("En juego")
                .build();

        Partido saved = partidosRepository.save(updated);
        fechaService.actualizarEstadoFecha(saved.getFecha());
        return PartidoMapper.toResponseDto(saved);
    }
}