/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';

import { AnunciosDTO } from './anuncios.dto';
import { StarCalification } from '../../domain/enumeration/star-calification';

/**
 * A ComentariosDTO object.
 */
export class ComentariosDTO extends BaseDTO {
    @ApiModelProperty({ description: 'text field' })
    text: any;

    @IsNotEmpty()
    @ApiModelProperty({ description: 'date field' })
    date: any;

    @ApiModelProperty({ enum: StarCalification, description: 'stars enum field', required: false })
    stars: StarCalification;

    @ApiModelProperty({ description: 'author field', required: false })
    author: string;

    @ApiModelProperty({ type: AnunciosDTO, description: 'anuncio relationship' })
    anuncio: AnunciosDTO;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
