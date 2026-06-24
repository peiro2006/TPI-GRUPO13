package com.example.TPI.PROG4.mappers;

import com.example.TPI.PROG4.dtos.request.PartidoCreateReqDto;
import com.example.TPI.PROG4.dtos.request.PartidoUpdateReqDto;
import com.example.TPI.PROG4.dtos.request.ResultadoRequestDto;
import com.example.TPI.PROG4.dtos.response.PartidoCreateResDto;
import com.example.TPI.PROG4.models.Fecha;
import com.example.TPI.PROG4.models.Partido;

import java.util.List;

public class PartidoMapper {

    public static Partido toModel (PartidoCreateReqDto request, Fecha fecha) {
        return Partido.builder()
                .fecha(fecha)
                .fechaPartido(request.fechaPartido())
                .horaInicio(request.horaInicio())
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
                partido.getHoraInicio(),
                partido.getVisitante(),
                partido.getLocal(),
                partido.getResultadoPartido(),
                partido.getEstadoPartido(),
                partido.getGolesLocal(),
                partido.getGolesVisitante(),
                partido.getResultadoTendencia()
        );
    }

    public static Partido applyResultado(Partido partido, ResultadoRequestDto request) {
        return partido.toBuilder()
                .golesLocal(request.golesLocal())
                .golesVisitante(request.golesVisitante())
                .resultadoPartido(request.golesLocal() + " - " + request.golesVisitante())
                .resultadoTendencia(calcularTendencia(request.golesLocal(), request.golesVisitante()))
                .build();
    }

    private static String calcularTendencia(Integer local, Integer visitante) {
        if (local > visitante) return "Local";
        if (local < visitante) return "Visitante";
        return "Empate";
    }

    public static Partido applyUpdate(Partido partido, PartidoUpdateReqDto request) {
        Partido.PartidoBuilder builder = partido.toBuilder();

        if (request.fechaPartido() != null) {
            builder.fechaPartido(request.fechaPartido());
        }
        if (request.horaInicio() != null) {
            builder.horaInicio(request.horaInicio());
        }
        if (request.estadoPartido() != null) {
            builder.estadoPartido(request.estadoPartido());
        }
        if (request.resultadoPartido() != null && !request.resultadoPartido().isBlank()) {
            builder.resultadoPartido(request.resultadoPartido());
            builder.estadoPartido("Finalizado");
        }

        return builder.build();
    }

    public static List<PartidoCreateResDto> toResponseDtoList (List<Partido> models) {
        return models.stream()
                .map(PartidoMapper::toResponseDto)
                .toList();
    }
}
