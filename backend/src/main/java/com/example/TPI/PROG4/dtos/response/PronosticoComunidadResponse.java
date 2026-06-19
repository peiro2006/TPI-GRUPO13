package com.example.TPI.PROG4.dtos.response;

public record PronosticoComunidadResponse(
        String nombreUsuario,
        String apellidoUsuario,
        Integer golesLocal,
        Integer golesVisitante
) {}
