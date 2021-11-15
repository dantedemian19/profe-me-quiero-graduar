/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';

/**
 * A AnunciosDTO object.
 */
export class AnunciosDTO extends BaseDTO {
    @IsNotEmpty()
    @ApiModelProperty({ description: 'title field' })
    title: string;

    @ApiModelProperty({ description: 'photo field', required: false })
    photo: any;

    photoContentType: string;

    @ApiModelProperty({ description: 'text field' })
    text: any;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
