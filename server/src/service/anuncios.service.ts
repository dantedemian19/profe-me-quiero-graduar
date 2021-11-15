import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { AnunciosDTO } from '../service/dto/anuncios.dto';
import { AnunciosMapper } from '../service/mapper/anuncios.mapper';
import { AnunciosRepository } from '../repository/anuncios.repository';

const relationshipNames = [];

@Injectable()
export class AnunciosService {
    logger = new Logger('AnunciosService');

    constructor(@InjectRepository(AnunciosRepository) private anunciosRepository: AnunciosRepository) {}

    async findById(id: number): Promise<AnunciosDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.anunciosRepository.findOne(id, options);
        return AnunciosMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<AnunciosDTO>): Promise<AnunciosDTO | undefined> {
        const result = await this.anunciosRepository.findOne(options);
        return AnunciosMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<AnunciosDTO>): Promise<[AnunciosDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.anunciosRepository.findAndCount(options);
        const anunciosDTO: AnunciosDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach((anuncios) => anunciosDTO.push(AnunciosMapper.fromEntityToDTO(anuncios)));
            resultList[0] = anunciosDTO;
        }
        return resultList;
    }

    async save(anunciosDTO: AnunciosDTO, creator?: string): Promise<AnunciosDTO | undefined> {
        const entity = AnunciosMapper.fromDTOtoEntity(anunciosDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.anunciosRepository.save(entity);
        return AnunciosMapper.fromEntityToDTO(result);
    }

    async update(anunciosDTO: AnunciosDTO, updater?: string): Promise<AnunciosDTO | undefined> {
        const entity = AnunciosMapper.fromDTOtoEntity(anunciosDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.anunciosRepository.save(entity);
        return AnunciosMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.anunciosRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
