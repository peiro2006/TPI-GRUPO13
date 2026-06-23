package com.example.TPI.PROG4.services.domain;

import com.example.TPI.PROG4.Interfaces.IPartidoUpdateService;
import com.example.TPI.PROG4.dtos.request.PartidoUpdateReqDto;
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
public class PartidoUpdateService implements IPartidoUpdateService {

    private final PartidosRepository partidosRepository;
    private final FechaService fechaService;

    @Override
    @Transactional
    public PartidoCreateResDto execute(Long id, PartidoUpdateReqDto request) {
        Partido partido = partidosRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Partido no encontrado"));

        Partido updated = PartidoMapper.applyUpdate(partido, request);
        Partido saved = partidosRepository.save(updated);

        fechaService.actualizarEstadoFecha(saved.getFecha());

        return PartidoMapper.toResponseDto(saved);
    }
}
