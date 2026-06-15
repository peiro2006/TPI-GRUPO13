package com.example.TPI.PROG4.Interfaces;

import com.example.TPI.PROG4.dtos.response.EquipoCreateResDto;

import java.math.BigDecimal;
import java.util.List;

public interface IEquipoListService {

    List<EquipoCreateResDto> execute(String nombre_equipo, String descripcion_equipo, String nombre_corto);

}
