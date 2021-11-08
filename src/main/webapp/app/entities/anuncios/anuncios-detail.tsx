import React, { useEffect } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { openFile, byteSize } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getEntity } from './anuncios.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

export const AnunciosDetail = (props: RouteComponentProps<{ id: string }>) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getEntity(props.match.params.id));
  }, []);

  const anunciosEntity = useAppSelector(state => state.anuncios.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="anunciosDetailsHeading">Anuncios</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{anunciosEntity.id}</dd>
          <dt>
            <span id="title">Title</span>
          </dt>
          <dd>{anunciosEntity.title}</dd>
          <dt>
            <span id="photo">Photo</span>
          </dt>
          <dd>
            {anunciosEntity.photo ? (
              <div>
                {anunciosEntity.photoContentType ? (
                  <a onClick={openFile(anunciosEntity.photoContentType, anunciosEntity.photo)}>
                    <img src={`data:${anunciosEntity.photoContentType};base64,${anunciosEntity.photo}`} style={{ maxHeight: '30px' }} />
                  </a>
                ) : null}
                <span>
                  {anunciosEntity.photoContentType}, {byteSize(anunciosEntity.photo)}
                </span>
              </div>
            ) : null}
          </dd>
          <dt>
            <span id="text">Text</span>
          </dt>
          <dd>{anunciosEntity.text}</dd>
        </dl>
        <Button tag={Link} to="/anuncios" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/anuncios/${anunciosEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

export default AnunciosDetail;
