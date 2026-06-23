package com.example.TPI.PROG4.dtos.response;

public record EquipoCreateResDto (

        Short id_equipo,
        String nombre_equipo,
        String descripcion,
        String nombre_corto,
        String bandera_codigo,
        boolean estado_equipo

) {
}
