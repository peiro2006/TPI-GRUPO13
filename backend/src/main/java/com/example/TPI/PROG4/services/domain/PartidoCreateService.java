package com.example.TPI.PROG4.services.domain;

import com.example.TPI.PROG4.Interfaces.IPartidoCreateService;
import com.example.TPI.PROG4.dtos.request.PartidoCreateReqDto;
import com.example.TPI.PROG4.dtos.response.PartidoCreateResDto;
import com.example.TPI.PROG4.mappers.PartidoMapper;
import com.example.TPI.PROG4.repositories.PartidosRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class PartidoCreateService implements IPartidoCreateService {

    private final PartidosRepository partidos;

    @Override
    public PartidoCreateResDto execute(PartidoCreateReqDto request){
        return PartidoMapper.toResponseDto(partidos.save(PartidoMapper.toModel(request)));
    }


}
