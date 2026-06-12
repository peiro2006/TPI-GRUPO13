package com.example.TPI.PROG4.services.domain;

import com.example.TPI.PROG4.Interfaces.IEquipoGetService;
import com.example.TPI.PROG4.configs.exceptions.NotFoundException;
import com.example.TPI.PROG4.dtos.response.EquipoCreateResDto;
import com.example.TPI.PROG4.mappers.EquipoMapper;
import com.example.TPI.PROG4.models.Equipo;
import com.example.TPI.PROG4.repositories.EquiposRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class EquipoGetService implements IEquipoGetService {

    private final EquiposRepository equiposRepo;

    @Override
    public EquipoCreateResDto execute(Short id) {

        Equipo equipo = equiposRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("Equipo no encontrado"));

        return EquipoMapper.toResponseDto(equipo);
    }
}
