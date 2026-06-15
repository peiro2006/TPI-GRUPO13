package com.example.TPI.PROG4.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "equipo")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
public class Equipo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_equipo")
    private Short idEquipo;

    @NotBlank(message = "Debe ingresar un nombre para el equipo")
    @Size(min = 4, max = 20, message = "El equipo debe tener entre 4 a 20 caracteres")
    @Column(name = "nombre_equipo")
    private String nombreEquipo;

    @Size(max = 200, message = "La descripcion debe ocupar menos de 200 caracteres")
    @Column(name = "descripcion_equipo")
    private String descripcionEquipo;

    @Size(min = 3, max = 3, message = "El nombre corto debe ser solo de 3 letras")
    @Column(name = "nombre_corto")
    private String nombreCorto;

    @Builder.Default
    @Column(name = "estado_equipo")
    private boolean estadoEquipo = true; /* ACTIVO - INACTIVO */
}
