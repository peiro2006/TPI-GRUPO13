package com.example.TPI.PROG4.services.domain;

import com.example.TPI.PROG4.Interfaces.IPartidoListService;
import com.example.TPI.PROG4.dtos.response.PartidoCreateResDto;
import com.example.TPI.PROG4.mappers.PartidoMapper;
import com.example.TPI.PROG4.models.Partido;
import com.example.TPI.PROG4.repositories.PartidosRepository;
import com.example.TPI.PROG4.repositories.specs.PartidoSpecs;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class PartidoListService implements IPartidoListService {

    private final PartidosRepository partidosRepo;

    @Override
    public List<PartidoCreateResDto> execute(String fechaPartido, String visitante, String local) {
        List<Partido> partidos = partidosRepo.findAll(
                PartidoSpecs.filtrarPartidos(fechaPartido, visitante, local),
                Sort.by(Sort.Direction.ASC, "fechaPartido")
        );
        return PartidoMapper.toResponseDtoList(partidos);
    }

    @Override
    public List<PartidoCreateResDto> executePorFecha(Long fechaId) {
        List<Partido> partidos = partidosRepo.findByFecha_IdFecha(
                fechaId,
                Sort.by(Sort.Direction.ASC, "fechaPartido")
        );
        return PartidoMapper.toResponseDtoList(partidos);
    }
}
