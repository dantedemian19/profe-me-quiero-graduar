import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { byteSize, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './comentarios.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IComentariosDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const ComentariosDetail = (props: IComentariosDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { comentariosEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="comentariosDetailsHeading">Comentarios</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{comentariosEntity.id}</dd>
          <dt>
            <span id="text">Text</span>
          </dt>
          <dd>{comentariosEntity.text}</dd>
          <dt>
            <span id="date">Date</span>
          </dt>
          <dd>{comentariosEntity.date ? <TextFormat value={comentariosEntity.date} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="stars">Stars</span>
          </dt>
          <dd>{comentariosEntity.stars}</dd>
          <dt>
            <span id="author">Author</span>
          </dt>
          <dd>{comentariosEntity.author}</dd>
          <dt>Anuncio</dt>
          <dd>{comentariosEntity.anuncio ? comentariosEntity.anuncio.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/comentarios" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/comentarios/${comentariosEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ comentarios }: IRootState) => ({
  comentariosEntity: comentarios.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(ComentariosDetail);
