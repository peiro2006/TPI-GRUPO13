package com.example.TPI.PROG4.services.domain;

import com.example.TPI.PROG4.Interfaces.IPartidoDeleteService;
import com.example.TPI.PROG4.models.Fecha;
import com.example.TPI.PROG4.models.Partido;
import com.example.TPI.PROG4.repositories.PartidosRepository;
import com.example.TPI.PROG4.repositories.PronosticoRepository;
import com.example.TPI.PROG4.services.FechaService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@AllArgsConstructor
public class PartidoDeleteService implements IPartidoDeleteService {

    private final PartidosRepository partidosRepository;
    private final PronosticoRepository pronosticoRepository;
    private final FechaService fechaService;

    @Override
    @Transactional
    public void execute(Long id) {
        Partido partido = partidosRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Partido no encontrado"));

        if (!"Por jugarse".equals(partido.getEstadoPartido())) {
            throw new RuntimeException("Solo se puede eliminar un partido en estado 'Por jugarse'");
        }

        Fecha fecha = partido.getFecha();
        if (pronosticoRepository.existsByPartido_IdPartido(id)) {
            throw new RuntimeException("No se puede eliminar un partido con pronósticos asociados");
        }

        partidosRepository.delete(partido);
        fechaService.actualizarEstadoFecha(fecha);
    }
}
