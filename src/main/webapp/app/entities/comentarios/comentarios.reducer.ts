import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IComentarios, defaultValue } from 'app/shared/model/comentarios.model';

export const ACTION_TYPES = {
  FETCH_COMENTARIOS_LIST: 'comentarios/FETCH_COMENTARIOS_LIST',
  FETCH_COMENTARIOS: 'comentarios/FETCH_COMENTARIOS',
  CREATE_COMENTARIOS: 'comentarios/CREATE_COMENTARIOS',
  UPDATE_COMENTARIOS: 'comentarios/UPDATE_COMENTARIOS',
  PARTIAL_UPDATE_COMENTARIOS: 'comentarios/PARTIAL_UPDATE_COMENTARIOS',
  DELETE_COMENTARIOS: 'comentarios/DELETE_COMENTARIOS',
  SET_BLOB: 'comentarios/SET_BLOB',
  RESET: 'comentarios/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IComentarios>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type ComentariosState = Readonly<typeof initialState>;

// Reducer

export default (state: ComentariosState = initialState, action): ComentariosState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_COMENTARIOS_LIST):
    case REQUEST(ACTION_TYPES.FETCH_COMENTARIOS):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_COMENTARIOS):
    case REQUEST(ACTION_TYPES.UPDATE_COMENTARIOS):
    case REQUEST(ACTION_TYPES.DELETE_COMENTARIOS):
    case REQUEST(ACTION_TYPES.PARTIAL_UPDATE_COMENTARIOS):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_COMENTARIOS_LIST):
    case FAILURE(ACTION_TYPES.FETCH_COMENTARIOS):
    case FAILURE(ACTION_TYPES.CREATE_COMENTARIOS):
    case FAILURE(ACTION_TYPES.UPDATE_COMENTARIOS):
    case FAILURE(ACTION_TYPES.PARTIAL_UPDATE_COMENTARIOS):
    case FAILURE(ACTION_TYPES.DELETE_COMENTARIOS):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_COMENTARIOS_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_COMENTARIOS):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_COMENTARIOS):
    case SUCCESS(ACTION_TYPES.UPDATE_COMENTARIOS):
    case SUCCESS(ACTION_TYPES.PARTIAL_UPDATE_COMENTARIOS):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_COMENTARIOS):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {},
      };
    case ACTION_TYPES.SET_BLOB: {
      const { name, data, contentType } = action.payload;
      return {
        ...state,
        entity: {
          ...state.entity,
          [name]: data,
          [name + 'ContentType']: contentType,
        },
      };
    }
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

const apiUrl = 'api/comentarios';

// Actions

export const getEntities: ICrudGetAllAction<IComentarios> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_COMENTARIOS_LIST,
    payload: axios.get<IComentarios>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IComentarios> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_COMENTARIOS,
    payload: axios.get<IComentarios>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IComentarios> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_COMENTARIOS,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IComentarios> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_COMENTARIOS,
    payload: axios.put(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const partialUpdate: ICrudPutAction<IComentarios> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.PARTIAL_UPDATE_COMENTARIOS,
    payload: axios.patch(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IComentarios> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_COMENTARIOS,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const setBlob = (name, data, contentType?) => ({
  type: ACTION_TYPES.SET_BLOB,
  payload: {
    name,
    data,
    contentType,
  },
});

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
