package com.example.TPI.PROG4.mappers;

import com.example.TPI.PROG4.dtos.request.PartidoCreateReqDto;
import com.example.TPI.PROG4.dtos.request.PartidoUpdateReqDto;
import com.example.TPI.PROG4.dtos.response.PartidoCreateResDto;
import com.example.TPI.PROG4.models.Fecha;
import com.example.TPI.PROG4.models.Partido;

import java.util.List;

public class PartidoMapper {

    public static Partido toModel (PartidoCreateReqDto request, Fecha fecha) {
        return Partido.builder()
                .fecha(fecha)
                .fechaPartido(request.fechaPartido())
                .local(request.local())
                .visitante(request.visitante())
                .resultadoPartido("")
                .estadoPartido("Por jugarse")
                .build();
    }

    public static PartidoCreateResDto toResponseDto (Partido partido) {
        return new PartidoCreateResDto(
                partido.getIdPartido(),
                partido.getFecha().getIdFecha(),
                partido.getFechaPartido(),
                partido.getVisitante(),
                partido.getLocal(),
                partido.getEstadoPartido()
        );

    }
    public static Partido updateFechaPartido(Partido partido, java.time.LocalDate fechaPartido) {
        return partido.toBuilder()
                .fechaPartido(fechaPartido)
                .build();
    }

    public static List<PartidoCreateResDto> toResponseDtoList (List<Partido> models) {
        return models.stream()
                .map(PartidoMapper::toResponseDto)
                .toList();
    }

}
