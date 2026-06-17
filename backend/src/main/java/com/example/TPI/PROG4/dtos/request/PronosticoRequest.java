package com.example.TPI.PROG4.dtos.request;

import jakarta.validation.constraints.NotNull;

public record PronosticoRequest(
        @NotNull Integer golesLocal,
        @NotNull Integer golesVisitante
) {}
