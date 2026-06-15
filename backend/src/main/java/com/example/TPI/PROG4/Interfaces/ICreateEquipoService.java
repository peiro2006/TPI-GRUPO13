package com.example.TPI.PROG4.Interfaces;

import com.example.TPI.PROG4.dtos.request.EquipoCreateReqDto;
import com.example.TPI.PROG4.dtos.response.EquipoCreateResDto;

public interface ICreateEquipoService {

    EquipoCreateResDto execute(EquipoCreateReqDto request);

}
