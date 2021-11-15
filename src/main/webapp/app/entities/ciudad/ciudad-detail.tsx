import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { openFile, byteSize } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './ciudad.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ICiudadDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const CiudadDetail = (props: ICiudadDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { ciudadEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="ciudadDetailsHeading">Ciudad</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{ciudadEntity.id}</dd>
          <dt>
            <span id="title">Title</span>
          </dt>
          <dd>{ciudadEntity.title}</dd>
          <dt>
            <span id="photo">Photo</span>
          </dt>
          <dd>
            {ciudadEntity.photo ? (
              <div>
                {ciudadEntity.photoContentType ? (
                  <a onClick={openFile(ciudadEntity.photoContentType, ciudadEntity.photo)}>
                    <img src={`data:${ciudadEntity.photoContentType};base64,${ciudadEntity.photo}`} style={{ maxHeight: '30px' }} />
                  </a>
                ) : null}
                <span>
                  {ciudadEntity.photoContentType}, {byteSize(ciudadEntity.photo)}
                </span>
              </div>
            ) : null}
          </dd>
          <dt>
            <span id="text">Text</span>
          </dt>
          <dd>{ciudadEntity.text}</dd>
        </dl>
        <Button tag={Link} to="/ciudad" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/ciudad/${ciudadEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ ciudad }: IRootState) => ({
  ciudadEntity: ciudad.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(CiudadDetail);
