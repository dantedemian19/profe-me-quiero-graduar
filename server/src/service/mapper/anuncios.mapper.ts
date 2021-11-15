import { Anuncios } from '../../domain/anuncios.entity';
import { AnunciosDTO } from '../dto/anuncios.dto';

/**
 * A Anuncios mapper object.
 */
export class AnunciosMapper {
    static fromDTOtoEntity(entityDTO: AnunciosDTO): Anuncios {
        if (!entityDTO) {
            return;
        }
        let entity = new Anuncios();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach((field) => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: Anuncios): AnunciosDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new AnunciosDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach((field) => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
