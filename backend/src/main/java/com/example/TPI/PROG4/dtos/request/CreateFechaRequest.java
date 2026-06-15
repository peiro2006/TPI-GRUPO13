package com.example.TPI.PROG4.dtos.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class CreateFechaRequest {

    @NotBlank(message = "El nombre de la fecha es obligatorio")
    @Size(max = 100, message = "El nombre de la fecha no puede superar los 100 caracteres")
    private String nombreFecha;

    private LocalDate inicioFecha;

    private LocalDate finFecha;
}