package com.example.TPI.PROG4.repositories;

import com.example.TPI.PROG4.models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    boolean existsByEmail(String email);
    List<Usuario> findAllByOrderByPuntosDescPronosticosAsc();
    List<Usuario> findAllByOrderByPuntosAscPronosticosDesc();
    List<Usuario> findByClanOrderByPuntosDescPronosticosAsc(String clan);
    List<Usuario> findByClanOrderByPuntosAscPronosticosDesc(String clan);
    List<String> findDistinctClanByClanIsNotNull();
}
