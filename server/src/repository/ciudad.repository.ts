import { EntityRepository, Repository } from 'typeorm';
import { Ciudad } from '../domain/ciudad.entity';

@EntityRepository(Ciudad)
export class CiudadRepository extends Repository<Ciudad> {}
