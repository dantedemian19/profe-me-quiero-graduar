package com.profe_me_quiero_graduar.app.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.profe_me_quiero_graduar.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AnunciosDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(AnunciosDTO.class);
        AnunciosDTO anunciosDTO1 = new AnunciosDTO();
        anunciosDTO1.setId(1L);
        AnunciosDTO anunciosDTO2 = new AnunciosDTO();
        assertThat(anunciosDTO1).isNotEqualTo(anunciosDTO2);
        anunciosDTO2.setId(anunciosDTO1.getId());
        assertThat(anunciosDTO1).isEqualTo(anunciosDTO2);
        anunciosDTO2.setId(2L);
        assertThat(anunciosDTO1).isNotEqualTo(anunciosDTO2);
        anunciosDTO1.setId(null);
        assertThat(anunciosDTO1).isNotEqualTo(anunciosDTO2);
    }
}
