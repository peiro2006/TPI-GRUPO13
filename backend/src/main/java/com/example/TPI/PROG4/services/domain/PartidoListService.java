package com.example.TPI.PROG4.services.domain;

import com.example.TPI.PROG4.Interfaces.IPartidoListService;
import com.example.TPI.PROG4.dtos.response.PartidoCreateResDto;
import com.example.TPI.PROG4.mappers.PartidoMapper;
import com.example.TPI.PROG4.models.Partido;
import com.example.TPI.PROG4.repositories.PartidosRepository;
import com.example.TPI.PROG4.repositories.specs.PartidoSpecs;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class PartidoListService implements IPartidoListService {

    private final PartidosRepository partidosRepo;

    @Override
    public List<PartidoCreateResDto> execute(String fechaPartido, String visitante, String local) {

        List<Partido> partidos = partidosRepo.findAll(
                PartidoSpecs.filtrarPartidos(fechaPartido, visitante, local)
        );

        return PartidoMapper.toResponseDtoList(partidos);
    }
}
