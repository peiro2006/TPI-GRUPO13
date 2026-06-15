package com.example.TPI.PROG4.dtos.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record EquipoCreateReqDto (

        @NotBlank(message = "Debe ingresar un nombre para el equipo")
        @Size(min = 4, max = 20, message = "El equipo debe tener entre 4 a 20 caracteres")
        String nombre_equipo,

        @Size(max = 200, message = "La descripcion debe ocupar menos de 200 caracteres")
        String descripcion,

        @NotBlank(message = "Debe ingresar un nombre corto para el equipo")
        @Size(min = 3, max = 3, message = "El nombre corto debe ser solo de 3 letras")
        String nombre_corto
){



}
