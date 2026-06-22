package com.example.TPI.PROG4.services;

import com.example.TPI.PROG4.dtos.response.PronosticoResponse;
import com.example.TPI.PROG4.models.Partido;
import com.example.TPI.PROG4.models.Pronostico;
import com.example.TPI.PROG4.models.Usuario;
import com.example.TPI.PROG4.repositories.PartidosRepository;
import com.example.TPI.PROG4.repositories.PronosticoRepository;
import com.example.TPI.PROG4.repositories.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PronosticoServiceTest {

    @Mock
    private PronosticoRepository pronosticoRepository;

    @Mock
    private PartidosRepository partidosRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private PronosticoService pronosticoService;

    @Test
    void crearPronosticoLoAsociaAlUsuarioYSincronizaSuContador() {
        Usuario usuario = usuario(2);
        Partido partido = partido();

        when(usuarioRepository.findById(usuario.getId())).thenReturn(Optional.of(usuario));
        when(partidosRepository.findById(partido.getIdPartido())).thenReturn(Optional.of(partido));
        when(pronosticoRepository.findByUsuario_IdAndPartido_IdPartido(usuario.getId(), partido.getIdPartido()))
                .thenReturn(Optional.empty());
        when(pronosticoRepository.save(any(Pronostico.class))).thenAnswer(invocation -> {
            Pronostico pronostico = invocation.getArgument(0);
            pronostico.setId(100L);
            return pronostico;
        });
        when(pronosticoRepository.countByUsuario_Id(usuario.getId())).thenReturn(3L);
        when(usuarioRepository.save(usuario)).thenReturn(usuario);

        PronosticoResponse response = pronosticoService.crearOActualizar(
                usuario, partido.getIdPartido(), 2, 1);

        ArgumentCaptor<Pronostico> pronosticoCaptor = ArgumentCaptor.forClass(Pronostico.class);
        verify(pronosticoRepository).save(pronosticoCaptor.capture());
        Pronostico guardado = pronosticoCaptor.getValue();

        assertThat(guardado.getUsuario()).isSameAs(usuario);
        assertThat(guardado.getPartido()).isSameAs(partido);
        assertThat(usuario.getPronosticos()).isEqualTo(3);
        assertThat(response.id()).isEqualTo(100L);
        assertThat(response.golesLocal()).isEqualTo(2);
        assertThat(response.golesVisitante()).isEqualTo(1);
        verify(usuarioRepository).save(usuario);
    }

    @Test
    void actualizarPronosticoExistenteSincronizaElContadorSinDuplicarlo() {
        Usuario usuario = usuario(1);
        Partido partido = partido();
        Pronostico existente = Pronostico.builder()
                .id(50L)
                .usuario(usuario)
                .partido(partido)
                .golesLocal(0)
                .golesVisitante(0)
                .build();

        when(usuarioRepository.findById(usuario.getId())).thenReturn(Optional.of(usuario));
        when(partidosRepository.findById(partido.getIdPartido())).thenReturn(Optional.of(partido));
        when(pronosticoRepository.findByUsuario_IdAndPartido_IdPartido(usuario.getId(), partido.getIdPartido()))
                .thenReturn(Optional.of(existente));
        when(pronosticoRepository.save(existente)).thenReturn(existente);
        when(pronosticoRepository.countByUsuario_Id(usuario.getId())).thenReturn(1L);
        when(usuarioRepository.save(usuario)).thenReturn(usuario);

        PronosticoResponse response = pronosticoService.crearOActualizar(
                usuario, partido.getIdPartido(), 3, 2);

        assertThat(existente.getGolesLocal()).isEqualTo(3);
        assertThat(existente.getGolesVisitante()).isEqualTo(2);
        assertThat(usuario.getPronosticos()).isEqualTo(1);
        assertThat(response.id()).isEqualTo(50L);
        verify(pronosticoRepository).save(existente);
        verify(usuarioRepository).save(usuario);
    }

    private Usuario usuario(Integer pronosticos) {
        return Usuario.builder()
                .id(1L)
                .nombre("Ada")
                .apellido("Lovelace")
                .email("ada@test.com")
                .password("secret")
                .pronosticos(pronosticos)
                .build();
    }

    private Partido partido() {
        return Partido.builder()
                .idPartido(10L)
                .local("Local")
                .visitante("Visitante")
                .estadoPartido("Por jugarse")
                .fechaPartido(LocalDate.now().plusDays(1))
                .build();
    }
}
