package com.example.TPI.PROG4.services.domain;

import com.example.TPI.PROG4.Interfaces.IPartidoUpdateService;
import com.example.TPI.PROG4.dtos.request.PartidoUpdateReqDto;
import com.example.TPI.PROG4.dtos.response.PartidoCreateResDto;
import com.example.TPI.PROG4.mappers.PartidoMapper;
import com.example.TPI.PROG4.models.Partido;
import com.example.TPI.PROG4.repositories.PartidosRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class PartidoUpdateService implements IPartidoUpdateService {

    private final PartidosRepository partidosRepository;

    @Override
    public PartidoCreateResDto execute(Long id, PartidoUpdateReqDto request) {
        Partido partido = partidosRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Partido no encontrado"));

        if (!"Por jugarse".equals(partido.getEstadoPartido())) {
            throw new RuntimeException("Solo se puede modificar un partido en estado programado");
        }

        Partido updated = PartidoMapper.updateFechaPartido(partido, request.fechaPartido());
        return PartidoMapper.toResponseDto(partidosRepository.save(updated));
    }
}
