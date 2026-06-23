package com.example.TPI.PROG4.dtos.request;

import java.time.LocalDate;
import java.time.LocalTime;

public record PartidoUpdateReqDto (
    LocalDate fechaPartido,
    LocalTime horaInicio,
    String resultadoPartido,
    String estadoPartido
) {}
