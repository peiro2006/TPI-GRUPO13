package com.example.TPI.PROG4.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "partidos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Partido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPartido;

    @ManyToOne
    @JoinColumn(name = "id_fecha", nullable = false)
    private Fecha fecha;
}
