package com.example.TPI.PROG4.Interfaces;

import com.example.TPI.PROG4.dtos.response.PartidoCreateResDto;

import java.util.List;

public interface IPartidoListService {

    List<PartidoCreateResDto> execute(String fechaPartido, String visitante, String local);

}
