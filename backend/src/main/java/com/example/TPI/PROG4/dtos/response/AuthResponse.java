package com.example.TPI.PROG4.dtos.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private Long id;
    private String token;
    private String nombre;
    private String apellido;
    private String email;
    private String rol;
    private String clan;
}
