import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IAnuncios, defaultValue } from 'app/shared/model/anuncios.model';

export const ACTION_TYPES = {
  FETCH_ANUNCIOS_LIST: 'anuncios/FETCH_ANUNCIOS_LIST',
  FETCH_ANUNCIOS: 'anuncios/FETCH_ANUNCIOS',
  CREATE_ANUNCIOS: 'anuncios/CREATE_ANUNCIOS',
  UPDATE_ANUNCIOS: 'anuncios/UPDATE_ANUNCIOS',
  PARTIAL_UPDATE_ANUNCIOS: 'anuncios/PARTIAL_UPDATE_ANUNCIOS',
  DELETE_ANUNCIOS: 'anuncios/DELETE_ANUNCIOS',
  SET_BLOB: 'anuncios/SET_BLOB',
  RESET: 'anuncios/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IAnuncios>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type AnunciosState = Readonly<typeof initialState>;

// Reducer

export default (state: AnunciosState = initialState, action): AnunciosState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_ANUNCIOS_LIST):
    case REQUEST(ACTION_TYPES.FETCH_ANUNCIOS):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_ANUNCIOS):
    case REQUEST(ACTION_TYPES.UPDATE_ANUNCIOS):
    case REQUEST(ACTION_TYPES.DELETE_ANUNCIOS):
    case REQUEST(ACTION_TYPES.PARTIAL_UPDATE_ANUNCIOS):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_ANUNCIOS_LIST):
    case FAILURE(ACTION_TYPES.FETCH_ANUNCIOS):
    case FAILURE(ACTION_TYPES.CREATE_ANUNCIOS):
    case FAILURE(ACTION_TYPES.UPDATE_ANUNCIOS):
    case FAILURE(ACTION_TYPES.PARTIAL_UPDATE_ANUNCIOS):
    case FAILURE(ACTION_TYPES.DELETE_ANUNCIOS):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_ANUNCIOS_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_ANUNCIOS):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_ANUNCIOS):
    case SUCCESS(ACTION_TYPES.UPDATE_ANUNCIOS):
    case SUCCESS(ACTION_TYPES.PARTIAL_UPDATE_ANUNCIOS):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_ANUNCIOS):
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

const apiUrl = 'api/anuncios';

// Actions

export const getEntities: ICrudGetAllAction<IAnuncios> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_ANUNCIOS_LIST,
    payload: axios.get<IAnuncios>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IAnuncios> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_ANUNCIOS,
    payload: axios.get<IAnuncios>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IAnuncios> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_ANUNCIOS,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IAnuncios> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_ANUNCIOS,
    payload: axios.put(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const partialUpdate: ICrudPutAction<IAnuncios> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.PARTIAL_UPDATE_ANUNCIOS,
    payload: axios.patch(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IAnuncios> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_ANUNCIOS,
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
