package com.example.TPI.PROG4.repositories;

import com.example.TPI.PROG4.models.Pronostico;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PronosticoRepository extends JpaRepository<Pronostico, Long> {
    boolean existsByPartido_IdPartido(Long idPartido);
}
