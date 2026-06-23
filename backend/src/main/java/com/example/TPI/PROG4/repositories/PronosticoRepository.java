package com.example.TPI.PROG4.repositories;

import com.example.TPI.PROG4.models.Pronostico;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PronosticoRepository extends JpaRepository<Pronostico, Long> {
    boolean existsByPartido_IdPartido(Long idPartido);
    Optional<Pronostico> findByUsuario_IdAndPartido_IdPartido(Long usuarioId, Long partidoId);
    List<Pronostico> findByUsuario_Id(Long usuarioId);
    long countByUsuario_Id(Long usuarioId);
    List<Pronostico> findByPartido_IdPartido(Long partidoId);
    void deleteByPartido_IdPartido(Long partidoId);
}
