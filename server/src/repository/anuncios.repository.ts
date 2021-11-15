import { EntityRepository, Repository } from 'typeorm';
import { Anuncios } from '../domain/anuncios.entity';

@EntityRepository(Anuncios)
export class AnunciosRepository extends Repository<Anuncios> {}
