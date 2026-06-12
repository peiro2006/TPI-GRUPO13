package com.example.TPI.PROG4.controllers.post;

import com.example.TPI.PROG4.dtos.request.CreateFechaRequest;
import com.example.TPI.PROG4.dtos.response.FechaResponse;
import com.example.TPI.PROG4.mappers.FechaMapper;
import com.example.TPI.PROG4.models.Fecha;
import com.example.TPI.PROG4.services.FechaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api/fechas")
@RequiredArgsConstructor
public class FechaController {

    private final FechaService fechaService;
    private final FechaMapper fechaMapper;

    @PostMapping
    public ResponseEntity<FechaResponse> crearFecha(@Valid @RequestBody CreateFechaRequest request) {
        Fecha fechaCreada = fechaService.crearFecha(request.getNombreFecha());
        FechaResponse response = fechaMapper.toResponse(fechaCreada);

        return ResponseEntity
                .created(URI.create("/api/fechas/" + response.getIdFecha()))
                .body(response);
    }
}