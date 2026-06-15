package com.example.TPI.PROG4.services;

import com.example.TPI.PROG4.Interfaces.IEquipoListService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class EquipoListServiceIntegrationTest {

    @Autowired
    private IEquipoListService equipoListService;

    @Test
    void listEquipoConsultaLaBaseSinErrores() {
        assertThat(equipoListService.execute(null, null, null)).isNotNull();
    }
}
