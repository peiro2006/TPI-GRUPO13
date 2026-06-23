package com.example.TPI.PROG4.services;

import com.example.TPI.PROG4.models.Partido;
import com.example.TPI.PROG4.models.Pronostico;
import com.example.TPI.PROG4.models.Usuario;
import com.example.TPI.PROG4.repositories.PronosticoRepository;
import com.example.TPI.PROG4.repositories.UsuarioRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class PronosticoPuntosService {

    private final PronosticoRepository pronosticoRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public void calcularPuntos(Partido partido) {
        Integer golesLocal = partido.getGolesLocal();
        Integer golesVisitante = partido.getGolesVisitante();
        if (golesLocal == null || golesVisitante == null) return;

        List<Pronostico> pronosticos = pronosticoRepository.findByPartido_IdPartido(partido.getIdPartido());

        for (Pronostico p : pronosticos) {
            int puntos = calcularPuntosPronostico(golesLocal, golesVisitante, p.getGolesLocal(), p.getGolesVisitante());
            Usuario usuario = p.getUsuario();
            usuario.setPuntos(usuario.getPuntos() + puntos);
            usuario.setPronosticos(usuario.getPronosticos() + 1);
            usuarioRepository.save(usuario);
        }
    }

    private int calcularPuntosPronostico(Integer realLocal, Integer realVisit, Integer pronoLocal, Integer pronoVisit) {
        if (realLocal.equals(pronoLocal) && realVisit.equals(pronoVisit)) {
            return 3;
        }
        String realResult = resultado(realLocal, realVisit);
        String pronoResult = resultado(pronoLocal, pronoVisit);
        if (realResult.equals(pronoResult)) {
            return 1;
        }
        return 0;
    }

    private String resultado(Integer local, Integer visitante) {
        if (local > visitante) return "L";
        if (local < visitante) return "V";
        return "E";
    }
}
