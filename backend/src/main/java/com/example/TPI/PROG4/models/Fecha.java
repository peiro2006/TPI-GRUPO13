package com.example.TPI.PROG4.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "fechas",
        uniqueConstraints = @UniqueConstraint(columnNames = "nombre_fecha")
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Fecha {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idFecha;

    @Column(name = "nombre_fecha", nullable = false, unique = true)
    private String nombreFecha;

    @Column(name = "estado_fecha", nullable = false)
    private String estadoFecha = "Programada";

    @Column(name = "inicio_fecha")
    private LocalDate inicioFecha;

    @Column(name = "fin_fecha")
    private LocalDate finFecha;

    @OneToMany(mappedBy = "fecha")
    private List<Partido> partidos = new ArrayList<>();
}