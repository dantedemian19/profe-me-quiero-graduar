import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { ComentariosDTO } from '../service/dto/comentarios.dto';
import { ComentariosMapper } from '../service/mapper/comentarios.mapper';
import { ComentariosRepository } from '../repository/comentarios.repository';

const relationshipNames = [];
relationshipNames.push('anuncio');

@Injectable()
export class ComentariosService {
    logger = new Logger('ComentariosService');

    constructor(@InjectRepository(ComentariosRepository) private comentariosRepository: ComentariosRepository) {}

    async findById(id: number): Promise<ComentariosDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.comentariosRepository.findOne(id, options);
        return ComentariosMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<ComentariosDTO>): Promise<ComentariosDTO | undefined> {
        const result = await this.comentariosRepository.findOne(options);
        return ComentariosMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<ComentariosDTO>): Promise<[ComentariosDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.comentariosRepository.findAndCount(options);
        const comentariosDTO: ComentariosDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach((comentarios) => comentariosDTO.push(ComentariosMapper.fromEntityToDTO(comentarios)));
            resultList[0] = comentariosDTO;
        }
        return resultList;
    }

    async save(comentariosDTO: ComentariosDTO, creator?: string): Promise<ComentariosDTO | undefined> {
        const entity = ComentariosMapper.fromDTOtoEntity(comentariosDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.comentariosRepository.save(entity);
        return ComentariosMapper.fromEntityToDTO(result);
    }

    async update(comentariosDTO: ComentariosDTO, updater?: string): Promise<ComentariosDTO | undefined> {
        const entity = ComentariosMapper.fromDTOtoEntity(comentariosDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.comentariosRepository.save(entity);
        return ComentariosMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.comentariosRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
