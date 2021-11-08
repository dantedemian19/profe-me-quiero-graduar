package com.profe_me_quiero_graduar.app.service.mapper;

import com.profe_me_quiero_graduar.app.domain.*;
import com.profe_me_quiero_graduar.app.service.dto.ComentariosDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Comentarios} and its DTO {@link ComentariosDTO}.
 */
@Mapper(componentModel = "spring", uses = { AnunciosMapper.class })
public interface ComentariosMapper extends EntityMapper<ComentariosDTO, Comentarios> {
    @Mapping(target = "anuncio", source = "anuncio", qualifiedByName = "id")
    ComentariosDTO toDto(Comentarios s);
}
