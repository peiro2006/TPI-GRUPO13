package com.example.TPI.PROG4.services;

import com.example.TPI.PROG4.dtos.response.RankingResponse;
import com.example.TPI.PROG4.models.Usuario;
import com.example.TPI.PROG4.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class RankingService {

    private final UsuarioRepository usuarioRepository;

    public List<RankingResponse> obtenerRanking(String orden, String clan) {
        List<Usuario> usuarios;

        boolean ascendente = "asc".equalsIgnoreCase(orden);
        boolean tieneClan = clan != null && !clan.isBlank();

        if (tieneClan) {
            usuarios = ascendente
                ? usuarioRepository.findByClanOrderByPuntosAscPronosticosDesc(clan)
                : usuarioRepository.findByClanOrderByPuntosDescPronosticosAsc(clan);
        } else {
            usuarios = ascendente
                ? usuarioRepository.findAllByOrderByPuntosAscPronosticosDesc()
                : usuarioRepository.findAllByOrderByPuntosDescPronosticosAsc();
        }

        List<RankingResponse> response = new ArrayList<>();
        for (int i = 0; i < usuarios.size(); i++) {
            Usuario u = usuarios.get(i);
            response.add(RankingResponse.builder()
                    .id(u.getId())
                    .nombre(u.getNombre())
                    .apellido(u.getApellido())
                    .email(u.getEmail())
                    .clan(u.getClan())
                    .puntos(u.getPuntos())
                    .pronosticos(u.getPronosticos())
                    .posicion(i + 1)
                    .build());
        }
        return response;
    }

    public List<String> obtenerClanes() {
        return usuarioRepository.findDistinctClanByClanIsNotNull();
    }

    public RankingResponse obtenerPerfil(Long id) {
        Usuario u = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return RankingResponse.builder()
                .id(u.getId())
                .nombre(u.getNombre())
                .apellido(u.getApellido())
                .email(u.getEmail())
                .clan(u.getClan())
                .puntos(u.getPuntos())
                .pronosticos(u.getPronosticos())
                .build();
    }
}
