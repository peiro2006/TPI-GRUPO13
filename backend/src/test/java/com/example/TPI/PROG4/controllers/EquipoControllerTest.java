package com.example.TPI.PROG4.controllers;

import com.example.TPI.PROG4.Interfaces.ICreateEquipoService;
import com.example.TPI.PROG4.Interfaces.IEquipoGetService;
import com.example.TPI.PROG4.Interfaces.IEquipoListService;
import com.example.TPI.PROG4.Interfaces.IEquipoSoftDeleteService;
import com.example.TPI.PROG4.dtos.response.EquipoCreateResDto;
import com.example.TPI.PROG4.security.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(EquipoController.class)
@AutoConfigureMockMvc(addFilters = false)
class EquipoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ICreateEquipoService equipoCreateService;

    @MockitoBean
    private IEquipoListService equipoList;

    @MockitoBean
    private IEquipoGetService equipoGet;

    @MockitoBean
    private IEquipoSoftDeleteService equipoSoftDeleteService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserDetailsService userDetailsService;

    @Test
    void listEquipoDevuelveEquiposOrdenadosDesdeGetBase() throws Exception {
        when(equipoList.execute(null, null, null)).thenReturn(List.of(
                new EquipoCreateResDto((short) 1, "Boca Juniors", "Club argentino", "BOC", null, true),
                new EquipoCreateResDto((short) 2, "River Plate", "Club argentino", "RIV", null, true)
        ));

        mockMvc.perform(get("/equipo"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Equipos listados correctamente"))
                .andExpect(jsonPath("$.data[0].nombre_equipo").value("Boca Juniors"))
                .andExpect(jsonPath("$.data[1].nombre_equipo").value("River Plate"));
    }

    @Test
    void getEquipoDevuelveDetalleDesdeGetConId() throws Exception {
        when(equipoGet.execute((short) 1)).thenReturn(
                new EquipoCreateResDto((short) 1, "Boca Juniors", "Club argentino", "BOC", null, true)
        );

        mockMvc.perform(get("/equipo/{id}", 1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Equipo obtenido correctamente"))
                .andExpect(jsonPath("$.data.id_equipo").value(1))
                .andExpect(jsonPath("$.data.nombre_equipo").value("Boca Juniors"))
                .andExpect(jsonPath("$.data.nombre_corto").value("BOC"))
                .andExpect(jsonPath("$.data.estado_equipo").value(true));
    }
}
