package com.example.TPI.PROG4.controllers.delete;

import com.example.TPI.PROG4.services.FechaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/fechas")
@RequiredArgsConstructor
public class DeleteFechaController {

    private final FechaService fechaService;

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarFecha(@PathVariable Long id) {
        fechaService.eliminarFecha(id);
        return ResponseEntity.noContent().build();
    }
}
