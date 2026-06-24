package com.example.TPI.PROG4.Interfaces;

import com.example.TPI.PROG4.dtos.response.PartidoCreateResDto;

public interface IPartidoIniciarService {
    PartidoCreateResDto execute(Long id);
}