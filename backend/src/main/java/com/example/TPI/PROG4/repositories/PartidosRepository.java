package com.example.TPI.PROG4.repositories;

import com.example.TPI.PROG4.models.Partido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface PartidosRepository extends JpaRepository<Partido, Long>, JpaSpecificationExecutor<Partido> {
}
