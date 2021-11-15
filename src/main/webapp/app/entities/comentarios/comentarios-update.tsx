import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { setFileData, byteSize, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IAnuncios } from 'app/shared/model/anuncios.model';
import { getEntities as getAnuncios } from 'app/entities/anuncios/anuncios.reducer';
import { getEntity, updateEntity, createEntity, setBlob, reset } from './comentarios.reducer';
import { IComentarios } from 'app/shared/model/comentarios.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IComentariosUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ComentariosUpdate = (props: IComentariosUpdateProps) => {
  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const { comentariosEntity, anuncios, loading, updating } = props;

  const { text } = comentariosEntity;

  const handleClose = () => {
    props.history.push('/comentarios' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getAnuncios();
  }, []);

  const onBlobChange = (isAnImage, name) => event => {
    setFileData(event, (contentType, data) => props.setBlob(name, data, contentType), isAnImage);
  };

  const clearBlob = name => () => {
    props.setBlob(name, undefined, undefined);
  };

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    values.date = convertDateTimeToServer(values.date);

    if (errors.length === 0) {
      const entity = {
        ...comentariosEntity,
        ...values,
        anuncio: anuncios.find(it => it.id.toString() === values.anuncioId.toString()),
      };

      if (isNew) {
        props.createEntity(entity);
      } else {
        props.updateEntity(entity);
      }
    }
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
            <AvForm model={isNew ? {} : comentariosEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="comentarios-id">ID</Label>
                  <AvInput id="comentarios-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="textLabel" for="comentarios-text">
                  Text
                </Label>
                <AvInput
                  id="comentarios-text"
                  data-cy="text"
                  type="textarea"
                  name="text"
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="dateLabel" for="comentarios-date">
                  Date
                </Label>
                <AvInput
                  id="comentarios-date"
                  data-cy="date"
                  type="datetime-local"
                  className="form-control"
                  name="date"
                  placeholder={'YYYY-MM-DD HH:mm'}
                  value={isNew ? displayDefaultDateTime() : convertDateTimeFromServer(props.comentariosEntity.date)}
                  validate={{
                    required: { value: true, errorMessage: 'This field is required.' },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="starsLabel" for="comentarios-stars">
                  Stars
                </Label>
                <AvInput
                  id="comentarios-stars"
                  data-cy="stars"
                  type="select"
                  className="form-control"
                  name="stars"
                  value={(!isNew && comentariosEntity.stars) || 'One'}
                >
                  <option value="One">One</option>
                  <option value="Two">Two</option>
                  <option value="Three">Three</option>
                  <option value="Four">Four</option>
                  <option value="Five">Five</option>
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label id="authorLabel" for="comentarios-author">
                  Author
                </Label>
                <AvField id="comentarios-author" data-cy="author" type="text" name="author" />
              </AvGroup>
              <AvGroup>
                <Label for="comentarios-anuncio">Anuncio</Label>
                <AvInput id="comentarios-anuncio" data-cy="anuncio" type="select" className="form-control" name="anuncioId">
                  <option value="" key="0" />
                  {anuncios
                    ? anuncios.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.id}
                        </option>
                      ))
                    : null}
                </AvInput>
                <AvFeedback>This field is required.</AvFeedback>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/comentarios" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">Back</span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp; Save
              </Button>
            </AvForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  anuncios: storeState.anuncios.entities,
  comentariosEntity: storeState.comentarios.entity,
  loading: storeState.comentarios.loading,
  updating: storeState.comentarios.updating,
  updateSuccess: storeState.comentarios.updateSuccess,
});

const mapDispatchToProps = {
  getAnuncios,
  getEntity,
  updateEntity,
  setBlob,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ComentariosUpdate);
