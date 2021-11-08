import React, { useState, useEffect } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IAnuncios } from 'app/shared/model/anuncios.model';
import { getEntities as getAnuncios } from 'app/entities/anuncios/anuncios.reducer';
import { getEntity, updateEntity, createEntity, reset } from './comentarios.reducer';
import { IComentarios } from 'app/shared/model/comentarios.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

export const ComentariosUpdate = (props: RouteComponentProps<{ id: string }>) => {
  const dispatch = useAppDispatch();

  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const anuncios = useAppSelector(state => state.anuncios.entities);
  const comentariosEntity = useAppSelector(state => state.comentarios.entity);
  const loading = useAppSelector(state => state.comentarios.loading);
  const updating = useAppSelector(state => state.comentarios.updating);
  const updateSuccess = useAppSelector(state => state.comentarios.updateSuccess);

  const handleClose = () => {
    props.history.push('/comentarios' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(props.match.params.id));
    }

    dispatch(getAnuncios({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    values.date = convertDateTimeToServer(values.date);

    const entity = {
      ...comentariosEntity,
      ...values,
      anuncio: anuncios.find(it => it.id.toString() === values.anuncioId.toString()),
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {
          date: displayDefaultDateTime(),
        }
      : {
          stars: 'One',
          ...comentariosEntity,
          date: convertDateTimeFromServer(comentariosEntity.date),
          anuncioId: comentariosEntity?.anuncio?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="profeMeQuieroGraduarApp.comentarios.home.createOrEditLabel" data-cy="ComentariosCreateUpdateHeading">
            Create or edit a Comentarios
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? <ValidatedField name="id" required readOnly id="comentarios-id" label="ID" validate={{ required: true }} /> : null}
              <ValidatedField
                label="Text"
                id="comentarios-text"
                name="text"
                data-cy="text"
                type="textarea"
                validate={{
                  required: { value: true, message: 'This field is required.' },
                }}
              />
              <ValidatedField
                label="Date"
                id="comentarios-date"
                name="date"
                data-cy="date"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
                validate={{
                  required: { value: true, message: 'This field is required.' },
                }}
              />
              <ValidatedField label="Stars" id="comentarios-stars" name="stars" data-cy="stars" type="select">
                <option value="One">one</option>
                <option value="Two">two</option>
                <option value="Three">three</option>
                <option value="Four">four</option>
                <option value="Five">five</option>
              </ValidatedField>
              <ValidatedField label="Author" id="comentarios-author" name="author" data-cy="author" type="text" />
              <ValidatedField id="comentarios-anuncio" name="anuncioId" data-cy="anuncio" label="Anuncio" type="select" required>
                <option value="" key="0" />
                {anuncios
                  ? anuncios.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <FormText>This field is required.</FormText>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/comentarios" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">Back</span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp; Save
              </Button>
            </ValidatedForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ComentariosUpdate;
