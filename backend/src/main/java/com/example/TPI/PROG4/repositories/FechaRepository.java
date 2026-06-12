package com.example.TPI.PROG4.repositories;

import com.example.TPI.PROG4.models.Fecha;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FechaRepository extends JpaRepository<Fecha, Long> {

    boolean existsByNombreFecha(String nombreFecha);
}