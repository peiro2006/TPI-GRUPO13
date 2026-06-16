package com.example.TPI.PROG4.repositories.specs;

import com.example.TPI.PROG4.models.Partido;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;

public class PartidoSpecs {

    public static Specification<Partido> filtrarPartidos(String fechaPartido, String visitante, String local) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (visitante != null && !visitante.isEmpty()) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("visitante")), "%" + visitante.toLowerCase() + "%"));
            }
            if (local != null && !local.isEmpty()) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("local")), "%" + local.toLowerCase() + "%"));
            }
            if (fechaPartido != null && !fechaPartido.isEmpty()) {
                try {
                    LocalDate date = LocalDate.parse(fechaPartido);
                    predicates.add(criteriaBuilder.equal(root.get("fechaPartido"), date));
                } catch (DateTimeParseException ignored) {
                }
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

}
