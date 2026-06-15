package com.example.TPI.PROG4.controllers.get;

import com.example.TPI.PROG4.dtos.response.FechaResponse;
import com.example.TPI.PROG4.mappers.FechaMapper;
import com.example.TPI.PROG4.services.FechaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/fechas")
@RequiredArgsConstructor
public class GetFechaController {

    private final FechaService fechaService;
    private final FechaMapper fechaMapper;

    @GetMapping
    public ResponseEntity<List<FechaResponse>> listarFechas(
            @RequestParam(defaultValue = "asc") String orden) {
        List<FechaResponse> response = fechaService.listarFechas(orden)
                .stream()
                .map(fechaMapper::toResponse)
                .toList();
        return ResponseEntity.ok(response);
    }
}