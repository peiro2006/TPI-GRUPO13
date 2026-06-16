package com.example.TPI.PROG4.dtos.request;

import com.example.TPI.PROG4.models.Fecha;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public record PartidoCreateReqDto (

         LocalDate fechaPartido,
         @NotBlank
         String visitante,
         @NotBlank
         String local
) {
}
