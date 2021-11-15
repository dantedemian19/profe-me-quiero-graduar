/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Anuncios } from './anuncios.entity';
import { StarCalification } from './enumeration/star-calification';

/**
 * A Comentarios.
 */
@Entity('comentarios')
export class Comentarios extends BaseEntity {
    @Column({ type: 'blob', name: 'text' })
    text: any;

    @Column({ type: 'datetime', name: 'date' })
    date: any;

    @Column({ type: 'simple-enum', name: 'stars', enum: StarCalification })
    stars: StarCalification;

    @Column({ name: 'author', nullable: true })
    author: string;

    @ManyToOne((type) => Anuncios)
    anuncio: Anuncios;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
