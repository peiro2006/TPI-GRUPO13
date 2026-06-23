package com.example.TPI.PROG4.mappers;

import com.example.TPI.PROG4.dtos.request.EquipoCreateReqDto;
import com.example.TPI.PROG4.dtos.response.EquipoCreateResDto;
import com.example.TPI.PROG4.models.Equipo;

import java.util.List;

public class EquipoMapper {

    public static Equipo toModel (EquipoCreateReqDto request) {
        return Equipo.builder()
                .nombreCorto(request.nombre_corto())
                .nombreEquipo(request.nombre_equipo())
                .descripcionEquipo(request.descripcion())
                .banderaCodigo(request.bandera_codigo())
                .build();
    }

    public static EquipoCreateResDto toResponseDto (Equipo equipo) {
        return new EquipoCreateResDto(
                equipo.getIdEquipo(),
                equipo.getNombreEquipo(),
                equipo.getDescripcionEquipo(),
                equipo.getNombreCorto(),
                equipo.getBanderaCodigo(),
                equipo.isEstadoEquipo()
        );

    }
    public static List<EquipoCreateResDto> toResponseDtoList (List<Equipo> models) {
        return models.stream()
                .map(EquipoMapper::toResponseDto)
                .toList();
    }

}
