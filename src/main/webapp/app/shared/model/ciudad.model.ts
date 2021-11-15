export interface ICiudad {
  id?: number;
  title?: string;
  photoContentType?: string | null;
  photo?: string | null;
  text?: string;
}

export const defaultValue: Readonly<ICiudad> = {};
