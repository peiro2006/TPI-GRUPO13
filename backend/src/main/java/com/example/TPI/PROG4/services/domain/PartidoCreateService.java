package com.example.TPI.PROG4.services.domain;

import com.example.TPI.PROG4.Interfaces.IPartidoCreateService;
import com.example.TPI.PROG4.dtos.request.PartidoCreateReqDto;
import com.example.TPI.PROG4.dtos.response.PartidoCreateResDto;
import com.example.TPI.PROG4.mappers.PartidoMapper;
import com.example.TPI.PROG4.models.Fecha;
import com.example.TPI.PROG4.repositories.FechaRepository;
import com.example.TPI.PROG4.repositories.PartidosRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@AllArgsConstructor
public class PartidoCreateService implements IPartidoCreateService {

    private final PartidosRepository partidos;
    private final FechaRepository fechaRepository;

    @Override
    public PartidoCreateResDto execute(PartidoCreateReqDto request){
        Fecha fecha = fechaRepository.findById(request.idFecha())
                .orElseThrow(() -> new RuntimeException("Fecha no encontrada"));

        if (request.fechaPartido() != null && fecha.getInicioFecha() != null && fecha.getFinFecha() != null) {
            LocalDate fechaPartido = request.fechaPartido();
            if (fechaPartido.isBefore(fecha.getInicioFecha()) || fechaPartido.isAfter(fecha.getFinFecha())) {
                throw new RuntimeException("La fecha del partido debe estar entre " + fecha.getInicioFecha() + " y " + fecha.getFinFecha());
            }
        }

        if (partidos.existsByFecha_IdFechaAndLocalAndVisitante(request.idFecha(), request.local(), request.visitante()) ||
            partidos.existsByFecha_IdFechaAndLocalAndVisitante(request.idFecha(), request.visitante(), request.local())) {
            throw new RuntimeException("Estos equipos ya tienen un partido en esta fecha");
        }

        if (partidos.existsEquipoEnFecha(request.idFecha(), request.local()) ||
            partidos.existsEquipoEnFecha(request.idFecha(), request.visitante())) {
            throw new RuntimeException("Un equipo no puede jugar más de un partido en la misma fecha");
        }

        return PartidoMapper.toResponseDto(partidos.save(PartidoMapper.toModel(request, fecha)));
    }

}

