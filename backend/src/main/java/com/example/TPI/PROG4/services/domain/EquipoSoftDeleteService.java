package com.example.TPI.PROG4.services.domain;

import com.example.TPI.PROG4.Interfaces.IEquipoSoftDeleteService;
import com.example.TPI.PROG4.configs.exceptions.ConflictException;
import com.example.TPI.PROG4.configs.exceptions.NotFoundException;
import com.example.TPI.PROG4.models.Equipo;
import com.example.TPI.PROG4.repositories.EquiposRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class EquipoSoftDeleteService implements IEquipoSoftDeleteService {

    private final EquiposRepository equiposRepository;

    @Override
    public void execute(Short id) {
        Equipo equipo = equiposRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Equipo no encontrado"));

        if (!equipo.isEstadoEquipo()) {
            throw new ConflictException("El equipo ya se encuentra inactivo");
        }

        equipo.setEstadoEquipo(false);

        equiposRepository.save(equipo);
    }

}
