import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Comentarios from './comentarios';
import ComentariosDetail from './comentarios-detail';
import ComentariosUpdate from './comentarios-update';
import ComentariosDeleteDialog from './comentarios-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ComentariosUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ComentariosUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ComentariosDetail} />
      <ErrorBoundaryRoute path={match.url} component={Comentarios} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ComentariosDeleteDialog} />
  </>
);

export default Routes;
