package com.example.TPI.PROG4.repositories;

import com.example.TPI.PROG4.models.Equipo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EquiposRepository extends JpaRepository<Equipo, Short>, JpaSpecificationExecutor<Equipo> {
    long count();
}
