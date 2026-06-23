package com.example.TPI.PROG4.services;

import com.example.TPI.PROG4.dtos.request.LoginRequest;
import com.example.TPI.PROG4.dtos.request.RegisterRequest;
import com.example.TPI.PROG4.dtos.response.AuthResponse;
import com.example.TPI.PROG4.models.Rol;
import com.example.TPI.PROG4.models.Usuario;
import com.example.TPI.PROG4.repositories.UsuarioRepository;
import com.example.TPI.PROG4.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }

        String password = request.getPassword();
        if (!password.matches(".*[A-Z].*")) {
            throw new RuntimeException("La contraseña debe contener al menos una mayúscula");
        }
        if (!password.matches(".*[0-9].*")) {
            throw new RuntimeException("La contraseña debe contener al menos un número");
        }

        var user = Usuario.builder()
                .nombre(request.getNombre())
                .apellido(request.getApellido())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .clan(request.getClan())
                .rol(Rol.USER)
                .build();

        userRepository.save(user);

        return buildAuthResponse(user);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Credenciales inválidas"));

        return buildAuthResponse(user);
    }

    private AuthResponse buildAuthResponse(Usuario usuario) {
        var jwt = jwtService.generateToken(usuario);

        return AuthResponse.builder()
                .id(usuario.getId())
                .token(jwt)
                .nombre(usuario.getNombre())
                .apellido(usuario.getApellido())
                .email(usuario.getEmail())
                .rol(usuario.getRol().name())
                .clan(usuario.getClan())
                .build();
    }
}
