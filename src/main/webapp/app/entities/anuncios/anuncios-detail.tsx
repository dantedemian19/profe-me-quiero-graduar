import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { openFile, byteSize } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './anuncios.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IAnunciosDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const AnunciosDetail = (props: IAnunciosDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { anunciosEntity } = props;
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

const mapStateToProps = ({ anuncios }: IRootState) => ({
  anunciosEntity: anuncios.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(AnunciosDetail);
