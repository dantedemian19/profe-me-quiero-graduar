package com.profe_me_quiero_graduar.app.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ComentariosMapperTest {

    private ComentariosMapper comentariosMapper;

    @BeforeEach
    public void setUp() {
        comentariosMapper = new ComentariosMapperImpl();
    }
}
