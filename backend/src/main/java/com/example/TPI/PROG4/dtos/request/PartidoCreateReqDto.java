package com.example.TPI.PROG4.dtos.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record PartidoCreateReqDto (
         @NotNull
         Long idFecha,
         LocalDate fechaPartido,
         @NotBlank
         String visitante,
         @NotBlank
         String local
) {}
