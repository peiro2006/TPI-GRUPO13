package com.example.TPI.PROG4.Interfaces;

import com.example.TPI.PROG4.dtos.request.PartidoCreateReqDto;
import com.example.TPI.PROG4.dtos.response.PartidoCreateResDto;

public interface IPartidoCreateService {

    PartidoCreateResDto execute(PartidoCreateReqDto request);
}
