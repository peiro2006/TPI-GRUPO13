package com.example.TPI.PROG4.dtos.response;

public record EquipoCreateResDto (

        Short id_equipo,
        String nombre_equipo,
        String descripcion,
        String nombre_corto,
        boolean estado_equipo

) {
}
