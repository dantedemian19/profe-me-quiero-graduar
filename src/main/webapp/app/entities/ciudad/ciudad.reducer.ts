import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ICiudad, defaultValue } from 'app/shared/model/ciudad.model';

export const ACTION_TYPES = {
  FETCH_CIUDAD_LIST: 'ciudad/FETCH_CIUDAD_LIST',
  FETCH_CIUDAD: 'ciudad/FETCH_CIUDAD',
  CREATE_CIUDAD: 'ciudad/CREATE_CIUDAD',
  UPDATE_CIUDAD: 'ciudad/UPDATE_CIUDAD',
  PARTIAL_UPDATE_CIUDAD: 'ciudad/PARTIAL_UPDATE_CIUDAD',
  DELETE_CIUDAD: 'ciudad/DELETE_CIUDAD',
  SET_BLOB: 'ciudad/SET_BLOB',
  RESET: 'ciudad/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ICiudad>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type CiudadState = Readonly<typeof initialState>;

// Reducer

export default (state: CiudadState = initialState, action): CiudadState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_CIUDAD_LIST):
    case REQUEST(ACTION_TYPES.FETCH_CIUDAD):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_CIUDAD):
    case REQUEST(ACTION_TYPES.UPDATE_CIUDAD):
    case REQUEST(ACTION_TYPES.DELETE_CIUDAD):
    case REQUEST(ACTION_TYPES.PARTIAL_UPDATE_CIUDAD):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_CIUDAD_LIST):
    case FAILURE(ACTION_TYPES.FETCH_CIUDAD):
    case FAILURE(ACTION_TYPES.CREATE_CIUDAD):
    case FAILURE(ACTION_TYPES.UPDATE_CIUDAD):
    case FAILURE(ACTION_TYPES.PARTIAL_UPDATE_CIUDAD):
    case FAILURE(ACTION_TYPES.DELETE_CIUDAD):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_CIUDAD_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_CIUDAD):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_CIUDAD):
    case SUCCESS(ACTION_TYPES.UPDATE_CIUDAD):
    case SUCCESS(ACTION_TYPES.PARTIAL_UPDATE_CIUDAD):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_CIUDAD):
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

const apiUrl = 'api/ciudads';

// Actions

export const getEntities: ICrudGetAllAction<ICiudad> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_CIUDAD_LIST,
    payload: axios.get<ICiudad>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<ICiudad> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_CIUDAD,
    payload: axios.get<ICiudad>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<ICiudad> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_CIUDAD,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ICiudad> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_CIUDAD,
    payload: axios.put(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const partialUpdate: ICrudPutAction<ICiudad> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.PARTIAL_UPDATE_CIUDAD,
    payload: axios.patch(`${apiUrl}/${entity.id}`, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<ICiudad> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_CIUDAD,
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
