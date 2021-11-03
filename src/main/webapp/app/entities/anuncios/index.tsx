import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Anuncios from './anuncios';
import AnunciosDetail from './anuncios-detail';
import AnunciosUpdate from './anuncios-update';
import AnunciosDeleteDialog from './anuncios-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={AnunciosUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={AnunciosUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={AnunciosDetail} />
      <ErrorBoundaryRoute path={match.url} component={Anuncios} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={AnunciosDeleteDialog} />
  </>
);

export default Routes;
