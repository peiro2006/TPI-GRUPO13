package com.example.TPI.PROG4.dtos.response;

import com.example.TPI.PROG4.models.Fecha;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public record PartidoCreateResDto (
        Long idPartido,
        Long idFecha,
        LocalDate fechaPartido,
        String visitante,
        String local,
        String estadoPartido

) {

}
