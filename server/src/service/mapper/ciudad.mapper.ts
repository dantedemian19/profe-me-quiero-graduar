import { Ciudad } from '../../domain/ciudad.entity';
import { CiudadDTO } from '../dto/ciudad.dto';

/**
 * A Ciudad mapper object.
 */
export class CiudadMapper {
    static fromDTOtoEntity(entityDTO: CiudadDTO): Ciudad {
        if (!entityDTO) {
            return;
        }
        let entity = new Ciudad();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach((field) => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: Ciudad): CiudadDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new CiudadDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach((field) => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
