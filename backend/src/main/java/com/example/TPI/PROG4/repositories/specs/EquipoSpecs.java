package com.example.TPI.PROG4.repositories.specs;

import com.example.TPI.PROG4.models.Equipo;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class EquipoSpecs {

    public static Specification<Equipo> filtrarEquipos(String nombre_equipo, String descripcion_equipo, String nombre_corto) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (nombre_equipo != null && !nombre_equipo.isEmpty()) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("nombreEquipo")), "%" + nombre_equipo.toLowerCase() + "%"));
            }
            if (nombre_corto != null && !nombre_corto.isEmpty()) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("nombreCorto")), "%" + nombre_corto.toLowerCase() + "%"));
            }
            if (descripcion_equipo != null && !descripcion_equipo.isEmpty()) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("descripcionEquipo")), "%" + descripcion_equipo.toLowerCase() + "%"));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

}
