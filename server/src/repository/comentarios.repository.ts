import { EntityRepository, Repository } from 'typeorm';
import { Comentarios } from '../domain/comentarios.entity';

@EntityRepository(Comentarios)
export class ComentariosRepository extends Repository<Comentarios> {}
