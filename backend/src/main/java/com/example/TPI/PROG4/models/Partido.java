package com.example.TPI.PROG4.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "partidos")
@Getter
@Setter
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class Partido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPartido;

    @ManyToOne
    @JoinColumn(name = "id_fecha", nullable = false)
    private Fecha fecha;

    @Column(name="fecha_partido")
    private LocalDate fechaPartido;

    @Column(name = "hora_inicio")
    private LocalTime horaInicio;

    @Column(name="resultado_partido")
    private String resultadoPartido;

    @Column(name = "goles_local")
    private Integer golesLocal;

    @Column(name = "goles_visitante")
    private Integer golesVisitante;

    @NotBlank
    @Column(name="equipo_visitante")
    private String visitante;

    @NotBlank
    @Column(name="equipo_local")
    private String local;

    @Column(name = "estado_partido")
    private String estadoPartido = "Por jugarse";

    @Column(name = "resultado_tendencia")
    private String resultadoTendencia;
}
