package com.example.TPI.PROG4.Interfaces;

import com.example.TPI.PROG4.dtos.request.ResultadoRequestDto;
import com.example.TPI.PROG4.dtos.response.PartidoCreateResDto;

public interface IPartidoFinalizarService {
    PartidoCreateResDto execute(Long id, ResultadoRequestDto request);
}
