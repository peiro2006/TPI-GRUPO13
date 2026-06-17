package com.example.TPI.PROG4.dtos.response;

import java.time.LocalDate;

public record PartidoCreateResDto (
        Long idPartido,
        Long idFecha,
        LocalDate fechaPartido,
        String visitante,
        String local,
        String estadoPartido
) {}
