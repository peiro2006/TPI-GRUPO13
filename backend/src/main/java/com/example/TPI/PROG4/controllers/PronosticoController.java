package com.example.TPI.PROG4.controllers;

import com.example.TPI.PROG4.dtos.request.PronosticoRequest;
import com.example.TPI.PROG4.dtos.response.PronosticoComunidadResponse;
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
        System.out.println("==== PRONOSTICOS /proximos llamado ====");
        try {
            Usuario usuario = getUsuario(auth);
            System.out.println("==== Usuario: " + usuario.getEmail() + " ====");
            List<PronosticoResponse> result = pronosticoService.listarProximos(usuario.getId());
            System.out.println("==== Resultados: " + result.size() + " ====");
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            System.out.println("==== ERROR: " + e.getMessage() + " ====");
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/partido/{partidoId}/comunidad")
    public ResponseEntity<?> listarPronosticosComunidad(
            @PathVariable Long partidoId, Authentication auth) {
        try {
            Usuario usuario = getUsuario(auth);
            List<PronosticoComunidadResponse> result = pronosticoService.obtenerPronosticosComunidad(partidoId, usuario.getId());
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/mispronosticos")
    public ResponseEntity<List<PronosticoResponse>> listarMisPronosticos(Authentication auth) {
        Usuario usuario = getUsuario(auth);
        List<PronosticoResponse> result = pronosticoService.listarMisPronosticos(usuario.getId());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/partido/{partidoId}")
    public ResponseEntity<PronosticoResponse> obtenerPorPartido(
            @PathVariable Long partidoId, Authentication auth) {
        Usuario usuario = getUsuario(auth);
        return ResponseEntity.ok(pronosticoService.obtenerPorPartido(usuario.getId(), partidoId));
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
