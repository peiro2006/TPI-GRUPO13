package com.example.TPI.PROG4.dtos.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record ResultadoRequestDto (
    @NotNull(message = "Los goles del equipo local son obligatorios")
    @Min(value = 0, message = "Los goles no pueden ser negativos")
    Integer golesLocal,

    @NotNull(message = "Los goles del equipo visitante son obligatorios")
    @Min(value = 0, message = "Los goles no pueden ser negativos")
    Integer golesVisitante
) {}
