package com.example.TPI.PROG4.Interfaces;

import com.example.TPI.PROG4.dtos.request.PartidoUpdateReqDto;
import com.example.TPI.PROG4.dtos.response.PartidoCreateResDto;

public interface IPartidoUpdateService {
    PartidoCreateResDto execute(Long id, PartidoUpdateReqDto request);
}
