package com.example.TPI.PROG4.services.domain;

import com.example.TPI.PROG4.Interfaces.ICreateEquipoService;
import com.example.TPI.PROG4.configs.exceptions.LimiteEquipoException;
import com.example.TPI.PROG4.dtos.request.EquipoCreateReqDto;
import com.example.TPI.PROG4.dtos.response.EquipoCreateResDto;
import com.example.TPI.PROG4.mappers.EquipoMapper;
import com.example.TPI.PROG4.repositories.EquiposRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class EquipoCreateService implements ICreateEquipoService {

    private final EquiposRepository equipos;

    @Override
    public EquipoCreateResDto execute(EquipoCreateReqDto request){

        if (equipos.count() >= 32) {
            throw new LimiteEquipoException("Se ha sobrepasado la cantidad máxima de equipos.");
        }else {
            return EquipoMapper.toResponseDto(equipos.save(EquipoMapper.toModel(request)));
        }

    }

}
