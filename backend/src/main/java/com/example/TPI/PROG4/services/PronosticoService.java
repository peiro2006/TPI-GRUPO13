package com.example.TPI.PROG4.services;

import com.example.TPI.PROG4.dtos.response.PronosticoResponse;
import com.example.TPI.PROG4.models.Partido;
import com.example.TPI.PROG4.models.Pronostico;
import com.example.TPI.PROG4.models.Usuario;
import com.example.TPI.PROG4.repositories.PartidosRepository;
import com.example.TPI.PROG4.repositories.PronosticoRepository;
import com.example.TPI.PROG4.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PronosticoService {

    private static final Logger log = LoggerFactory.getLogger(PronosticoService.class);
    private final PronosticoRepository pronosticoRepository;
    private final PartidosRepository partidosRepository;
    private final UsuarioRepository usuarioRepository;

    private boolean esEditable(Partido partido) {
        try {
            if (!"Por jugarse".equals(partido.getEstadoPartido())) return false;
            if (partido.getFechaPartido() == null || partido.getHoraInicio() == null) return true;
            LocalDateTime matchDateTime = LocalDateTime.of(partido.getFechaPartido(), partido.getHoraInicio());
            return LocalDateTime.now().isBefore(matchDateTime.minusMinutes(30));
        } catch (Exception e) {
            log.warn("Error al verificar editable para partido {}: {}", partido.getIdPartido(), e.getMessage());
            return true;
        }
    }

    @Transactional
    public PronosticoResponse crearOActualizar(Usuario usuario, Long partidoId, Integer golesLocal, Integer golesVisitante) {
        Usuario usuarioPersistido = usuarioRepository.findById(usuario.getId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Partido partido = partidosRepository.findById(partidoId)
                .orElseThrow(() -> new RuntimeException("Partido no encontrado"));

        if (!esEditable(partido)) {
            throw new RuntimeException("No se puede pronosticar: el partido empezó o falta menos de 30 minutos");
        }

        if (golesLocal < 0 || golesVisitante < 0) {
            throw new RuntimeException("Los goles deben ser 0 o mayores");
        }

        Optional<Pronostico> existente = pronosticoRepository
                .findByUsuario_IdAndPartido_IdPartido(usuario.getId(), partidoId);

        Pronostico pronostico;
        if (existente.isPresent()) {
            pronostico = existente.get();
            pronostico.setGolesLocal(golesLocal);
            pronostico.setGolesVisitante(golesVisitante);
            pronostico.setFechaPronostico(LocalDateTime.now());
        } else {
            pronostico = Pronostico.builder()
                    .usuario(usuarioPersistido)
                    .partido(partido)
                    .golesLocal(golesLocal)
                    .golesVisitante(golesVisitante)
                    .fechaPronostico(LocalDateTime.now())
                    .build();
        }

        pronostico = pronosticoRepository.save(pronostico);
        sincronizarPronosticosUsuario(usuarioPersistido);
        return toResponse(pronostico, partido);
    }

    private void sincronizarPronosticosUsuario(Usuario usuario) {
        long cantidadPronosticos = pronosticoRepository.countByUsuario_Id(usuario.getId());
        if (cantidadPronosticos > Integer.MAX_VALUE) {
            throw new RuntimeException("Cantidad de pronosticos fuera de rango");
        }

        usuario.setPronosticos((int) cantidadPronosticos);
        usuarioRepository.save(usuario);
    }

    public PronosticoResponse obtenerPorPartido(Long usuarioId, Long partidoId) {
        Partido partido = partidosRepository.findById(partidoId)
                .orElseThrow(() -> new RuntimeException("Partido no encontrado"));

        Optional<Pronostico> pronostico = pronosticoRepository
                .findByUsuario_IdAndPartido_IdPartido(usuarioId, partidoId);

        return pronostico.map(p -> toResponse(p, partido))
                .orElseGet(() -> new PronosticoResponse(
                        null, partidoId, partido.getLocal(), partido.getVisitante(),
                        partido.getFechaPartido(),
                        horaPartidoStr(partido),
                        partido.getEstadoPartido(), null, null, esEditable(partido)
                ));
    }

    public List<PronosticoResponse> listarPorUsuario(Long usuarioId, Usuario solicitante) {
        boolean esPropio = solicitante.getId().equals(usuarioId);
        boolean esAdmin = solicitante.getRol().name().equals("ADMIN");

        List<Pronostico> pronosticos = pronosticoRepository.findByUsuario_Id(usuarioId);
        return pronosticos.stream()
                .filter(p -> esPropio || esAdmin || !esEditable(p.getPartido()))
                .map(p -> toResponse(p, p.getPartido()))
                .sorted((a, b) -> {
                    int cmp = b.fechaPartido().compareTo(a.fechaPartido());
                    if (cmp != 0) return cmp;
                    return b.horaPartido().compareTo(a.horaPartido());
                })
                .toList();
    }

    public List<PronosticoResponse> listarProximos(Long usuarioId) {
        List<Partido> partidos;
        try {
            partidos = partidosRepository.findAll();
        } catch (Exception e) {
            log.error("Error al obtener partidos: {}", e.getMessage());
            return List.of();
        }

        List<PronosticoResponse> result = new ArrayList<>();

        for (Partido p : partidos) {
            try {
                if (!"Por jugarse".equals(p.getEstadoPartido())) continue;

                Optional<Pronostico> pronostico = pronosticoRepository
                        .findByUsuario_IdAndPartido_IdPartido(usuarioId, p.getIdPartido());

                if (pronostico.isPresent()) {
                    result.add(toResponse(pronostico.get(), p));
                } else {
                    result.add(new PronosticoResponse(
                            null, p.getIdPartido(), p.getLocal(), p.getVisitante(),
                            p.getFechaPartido(),
                            horaPartidoStr(p),
                            p.getEstadoPartido(), null, null, esEditable(p)
                    ));
                }
            } catch (Exception e) {
                log.warn("Error procesando partido {}: {}", p.getIdPartido(), e.getMessage());
            }
        }

        result.sort((a, b) -> {
            try {
                int cmp = a.fechaPartido().compareTo(b.fechaPartido());
                if (cmp != 0) return cmp;
                return a.horaPartido().compareTo(b.horaPartido());
            } catch (Exception e) {
                return 0;
            }
        });

        return result;
    }

    private PronosticoResponse toResponse(Pronostico p, Partido partido) {
        return new PronosticoResponse(
                p.getId(),
                partido.getIdPartido(),
                partido.getLocal(),
                partido.getVisitante(),
                partido.getFechaPartido(),
                horaPartidoStr(partido),
                partido.getEstadoPartido(),
                p.getGolesLocal(),
                p.getGolesVisitante(),
                esEditable(partido)
        );
    }

    private String horaPartidoStr(Partido partido) {
        return partido.getHoraInicio() != null ? partido.getHoraInicio().toString() : "20:00";
    }
}
