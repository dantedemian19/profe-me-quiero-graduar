package com.profe_me_quiero_graduar.app.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.profe_me_quiero_graduar.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ComentariosDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(ComentariosDTO.class);
        ComentariosDTO comentariosDTO1 = new ComentariosDTO();
        comentariosDTO1.setId(1L);
        ComentariosDTO comentariosDTO2 = new ComentariosDTO();
        assertThat(comentariosDTO1).isNotEqualTo(comentariosDTO2);
        comentariosDTO2.setId(comentariosDTO1.getId());
        assertThat(comentariosDTO1).isEqualTo(comentariosDTO2);
        comentariosDTO2.setId(2L);
        assertThat(comentariosDTO1).isNotEqualTo(comentariosDTO2);
        comentariosDTO1.setId(null);
        assertThat(comentariosDTO1).isNotEqualTo(comentariosDTO2);
    }
}
