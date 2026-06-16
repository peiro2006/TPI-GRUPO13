package com.example.TPI.PROG4.controllers;

import com.example.TPI.PROG4.Interfaces.*;
import com.example.TPI.PROG4.dtos.request.EquipoCreateReqDto;
import com.example.TPI.PROG4.dtos.request.PartidoCreateReqDto;
import com.example.TPI.PROG4.dtos.response.EquipoCreateResDto;
import com.example.TPI.PROG4.dtos.response.PartidoCreateResDto;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/partidos")
@CrossOrigin(origins = "http://localhost:4200")
@AllArgsConstructor

public class PartidoController {

    private final IPartidoCreateService partidoCreateService;
    private final IPartidoListService partidoList;

    @PostMapping
    public ResponseEntity<PartidoCreateResDto> createPartido(
            @Valid @RequestBody PartidoCreateReqDto request
    ) {
        return ResponseEntity.ok(

                        partidoCreateService.execute(request)
        );

    }

    @GetMapping
    public ResponseEntity<List<PartidoCreateResDto>> listPartido(
            @RequestParam(required = false) String fechaPartido,
            @RequestParam(required = false) String visitante,
            @RequestParam(required = false) String local) {

        return ResponseEntity.ok(
                partidoList.execute(fechaPartido, visitante, local)
        );
    }

    @GetMapping("/fecha/{fechaId}")
    public ResponseEntity<List<PartidoCreateResDto>> listarPorFecha(
            @PathVariable Long fechaId) {
        return ResponseEntity.ok(
                partidoList.executePorFecha(fechaId)
        );
    }

}
