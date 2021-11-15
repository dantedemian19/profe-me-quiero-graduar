import { Comentarios } from '../../domain/comentarios.entity';
import { ComentariosDTO } from '../dto/comentarios.dto';

/**
 * A Comentarios mapper object.
 */
export class ComentariosMapper {
    static fromDTOtoEntity(entityDTO: ComentariosDTO): Comentarios {
        if (!entityDTO) {
            return;
        }
        let entity = new Comentarios();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach((field) => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: Comentarios): ComentariosDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new ComentariosDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach((field) => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
