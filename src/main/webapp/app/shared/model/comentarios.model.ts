import dayjs from 'dayjs';
import { IAnuncios } from 'app/shared/model/anuncios.model';
import { StarCalification } from 'app/shared/model/enumerations/star-calification.model';

export interface IComentarios {
  id?: number;
  text?: string;
  date?: string;
  stars?: StarCalification | null;
  author?: string | null;
  anuncio?: IAnuncios;
}

export const defaultValue: Readonly<IComentarios> = {};
