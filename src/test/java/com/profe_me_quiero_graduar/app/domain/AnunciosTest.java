package com.profe_me_quiero_graduar.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.profe_me_quiero_graduar.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AnunciosTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Anuncios.class);
        Anuncios anuncios1 = new Anuncios();
        anuncios1.setId(1L);
        Anuncios anuncios2 = new Anuncios();
        anuncios2.setId(anuncios1.getId());
        assertThat(anuncios1).isEqualTo(anuncios2);
        anuncios2.setId(2L);
        assertThat(anuncios1).isNotEqualTo(anuncios2);
        anuncios1.setId(null);
        assertThat(anuncios1).isNotEqualTo(anuncios2);
    }
}
