package com.example.TPI.PROG4.dtos.response;

import java.time.LocalDate;
import java.time.LocalTime;

public record PartidoCreateResDto (
        Long idPartido,
        Long idFecha,
        LocalDate fechaPartido,
        LocalTime horaInicio,
        String visitante,
        String local,
        String resultadoPartido,
        String estadoPartido,
        Integer golesLocal,
        Integer golesVisitante,
        String resultadoTendencia
) {}
