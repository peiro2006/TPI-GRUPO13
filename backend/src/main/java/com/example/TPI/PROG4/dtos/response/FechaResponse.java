package com.example.TPI.PROG4.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class FechaResponse {

    private Long idFecha;
    private String nombreFecha;
    private String estadoFecha;
    private LocalDate inicioFecha;
    private LocalDate finFecha;
}