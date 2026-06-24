package com.example.TPI.PROG4.services;

import com.example.TPI.PROG4.models.Partido;
import com.example.TPI.PROG4.repositories.PartidosRepository;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@AllArgsConstructor
public class PartidoSchedulerService {

    private static final Logger log = LoggerFactory.getLogger(PartidoSchedulerService.class);
    private final PartidosRepository partidosRepository;
    private final FechaService fechaService;

    @Scheduled(fixedRate = 60000)
    public void iniciarPartidosProgramados() {
        List<Partido> porJugarse = partidosRepository.findByEstadoPartido("Por jugarse");
        LocalDateTime ahora = LocalDateTime.now();

        for (Partido partido : porJugarse) {
            if (partido.getFechaPartido() == null || partido.getHoraInicio() == null) continue;

            LocalDateTime inicioPartido = LocalDateTime.of(partido.getFechaPartido(), partido.getHoraInicio());
            if (!ahora.isBefore(inicioPartido)) {
                partido.setEstadoPartido("En juego");
                partidosRepository.save(partido);
                fechaService.actualizarEstadoFecha(partido.getFecha());
                log.info("Partido {} iniciado automaticamente", partido.getIdPartido());
            }
        }
    }
}