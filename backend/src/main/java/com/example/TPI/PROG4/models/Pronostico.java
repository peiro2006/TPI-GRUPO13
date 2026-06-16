package com.example.TPI.PROG4.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pronosticos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pronostico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_partido", nullable = false)
    private Partido partido;

}
