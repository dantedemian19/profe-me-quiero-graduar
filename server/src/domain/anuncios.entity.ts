/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

/**
 * A Anuncios.
 */
@Entity('anuncios')
export class Anuncios extends BaseEntity {
    @Column({ name: 'title' })
    title: string;

    @Column({ type: 'blob', name: 'photo', nullable: true })
    photo: any;

    @Column({ name: 'photo_content_type', nullable: true })
    photoContentType: string;

    @Column({ type: 'blob', name: 'text' })
    text: any;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
