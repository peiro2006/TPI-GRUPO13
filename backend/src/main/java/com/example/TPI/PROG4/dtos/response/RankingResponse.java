package com.example.TPI.PROG4.dtos.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RankingResponse {
    private Long id;
    private String nombre;
    private String apellido;
    private String email;
    private String clan;
    private Integer puntos;
    private Integer pronosticos;
    private Integer posicion;
}
