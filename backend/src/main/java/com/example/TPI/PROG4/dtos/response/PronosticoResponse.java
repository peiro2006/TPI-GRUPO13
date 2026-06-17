package com.example.TPI.PROG4.dtos.response;

import java.time.LocalDate;
import java.time.LocalTime;

public record PronosticoResponse(
        Long id,
        Long partidoId,
        String local,
        String visitante,
        LocalDate fechaPartido,
        String horaPartido,
        String estadoPartido,
        Integer golesLocal,
        Integer golesVisitante,
        boolean editable
) {}
