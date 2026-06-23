package com.example.TPI.PROG4.controllers;

import com.example.TPI.PROG4.dtos.request.PronosticoRequest;
import com.example.TPI.PROG4.dtos.response.PronosticoResponse;
import com.example.TPI.PROG4.models.Usuario;
import com.example.TPI.PROG4.repositories.UsuarioRepository;
import com.example.TPI.PROG4.services.PronosticoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pronosticos")
@RequiredArgsConstructor
public class PronosticoController {

    private final PronosticoService pronosticoService;
    private final UsuarioRepository usuarioRepository;

    @GetMapping("/proximos")
    public ResponseEntity<List<PronosticoResponse>> listarProximos(Authentication auth) {
        Usuario usuario = getUsuario(auth);
        return ResponseEntity.ok(pronosticoService.listarProximos(usuario.getId()));
    }

    @GetMapping("/partido/{partidoId}")
    public ResponseEntity<PronosticoResponse> obtenerPorPartido(
            @PathVariable Long partidoId, Authentication auth) {
        Usuario usuario = getUsuario(auth);
        return ResponseEntity.ok(pronosticoService.obtenerPorPartido(usuario.getId(), partidoId));
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<PronosticoResponse>> listarPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(pronosticoService.listarPorUsuario(usuarioId));
    }

    @PutMapping("/partido/{partidoId}")
    public ResponseEntity<PronosticoResponse> guardarPronostico(
            @PathVariable Long partidoId,
            @Valid @RequestBody PronosticoRequest request,
            Authentication auth) {
        Usuario usuario = getUsuario(auth);
        PronosticoResponse response = pronosticoService.crearOActualizar(
                usuario, partidoId, request.golesLocal(), request.golesVisitante());
        return ResponseEntity.ok(response);
    }

    private Usuario getUsuario(Authentication auth) {
        String email = auth.getName();
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
}
