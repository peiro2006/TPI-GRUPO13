package com.example.TPI.PROG4.mappers;

import com.example.TPI.PROG4.dtos.request.PartidoCreateReqDto;
import com.example.TPI.PROG4.dtos.response.PartidoCreateResDto;
import com.example.TPI.PROG4.models.Partido;

import java.util.List;

public class PartidoMapper {

    public static Partido toModel (PartidoCreateReqDto request) {
        return Partido.builder()
                .fechaPartido(request.fechaPartido())
                .local(request.local())
                .visitante(request.visitante())
                .build();
    }

    public static PartidoCreateResDto toResponseDto (Partido partido) {
        return new PartidoCreateResDto(
                partido.getIdPartido(),
                partido.getFechaPartido(),
                partido.getVisitante(),
                partido.getLocal(),
                partido.getEstadoPartido()
        );

    }
    public static List<PartidoCreateResDto> toResponseDtoList (List<Partido> models) {
        return models.stream()
                .map(PartidoMapper::toResponseDto)
                .toList();
    }

}
