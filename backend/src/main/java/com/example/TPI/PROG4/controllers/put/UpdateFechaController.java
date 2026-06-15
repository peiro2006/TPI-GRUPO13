package com.example.TPI.PROG4.controllers.put;

import com.example.TPI.PROG4.dtos.request.UpdateFechaRequest;
import com.example.TPI.PROG4.dtos.response.FechaResponse;
import com.example.TPI.PROG4.mappers.FechaMapper;
import com.example.TPI.PROG4.models.Fecha;
import com.example.TPI.PROG4.services.FechaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/fechas")
@RequiredArgsConstructor
public class UpdateFechaController {

    private final FechaService fechaService;
    private final FechaMapper fechaMapper;

    @PutMapping("/{id}")
    public ResponseEntity<FechaResponse> actualizarFecha(
            @PathVariable Long id,
            @Valid @RequestBody UpdateFechaRequest request) {
        Fecha fechaActualizada = fechaService.actualizarFecha(
                id,
                request.getNombreFecha(),
                request.getInicioFecha(),
                request.getFinFecha());
        return ResponseEntity.ok(fechaMapper.toResponse(fechaActualizada));
    }
}