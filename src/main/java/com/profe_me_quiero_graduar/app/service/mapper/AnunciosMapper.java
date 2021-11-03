package com.profe_me_quiero_graduar.app.service.mapper;

import com.profe_me_quiero_graduar.app.domain.*;
import com.profe_me_quiero_graduar.app.service.dto.AnunciosDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Anuncios} and its DTO {@link AnunciosDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface AnunciosMapper extends EntityMapper<AnunciosDTO, Anuncios> {
    @Named("id")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    AnunciosDTO toDtoId(Anuncios anuncios);
}
