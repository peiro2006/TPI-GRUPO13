package com.example.TPI.PROG4.services.domain;

import com.example.TPI.PROG4.Interfaces.IEquipoListService;
import com.example.TPI.PROG4.dtos.response.EquipoCreateResDto;
import com.example.TPI.PROG4.mappers.EquipoMapper;
import com.example.TPI.PROG4.models.Equipo;
import com.example.TPI.PROG4.repositories.EquiposRepository;
import com.example.TPI.PROG4.repositories.specs.EquipoSpecs;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class EquipoListService implements IEquipoListService {

    private final EquiposRepository equiposRepo;

    @Override
    public List<EquipoCreateResDto> execute(String nombre_equipo, String descripcion_equipo, String nombre_corto) {

        List<Equipo> equipos = equiposRepo.findAll(
                EquipoSpecs.filtrarEquipos(nombre_equipo, descripcion_equipo, nombre_corto), Sort.by("nombreEquipo").ascending()
        );

        return EquipoMapper.toResponseDtoList(equipos);
    }
}
