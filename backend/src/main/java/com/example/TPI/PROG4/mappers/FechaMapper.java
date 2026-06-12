package com.example.TPI.PROG4.mappers;

import com.example.TPI.PROG4.dtos.response.FechaResponse;
import com.example.TPI.PROG4.models.Fecha;
import org.springframework.stereotype.Component;

@Component
public class FechaMapper {

    public FechaResponse toResponse(Fecha fecha) {
        return new FechaResponse(
                fecha.getIdFecha(),
                fecha.getNombreFecha(),
                fecha.getEstadoFecha(),
                fecha.getInicioFecha(),
                fecha.getFinFecha()
        );
    }
}