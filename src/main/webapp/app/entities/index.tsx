import React from 'react';
import { Switch } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Anuncios from './anuncios';
import Comentarios from './comentarios';
import Ciudad from './ciudad';
/* jhipster-needle-add-route-import - JHipster will add routes here */

const Routes = ({ match }) => (
  <div>
    <Switch>
      {/* prettier-ignore */}
      <ErrorBoundaryRoute path={`${match.url}anuncios`} component={Anuncios} />
      <ErrorBoundaryRoute path={`${match.url}comentarios`} component={Comentarios} />
      <ErrorBoundaryRoute path={`${match.url}ciudad`} component={Ciudad} />
      {/* jhipster-needle-add-route-path - JHipster will add routes here */}
    </Switch>
  </div>
);

export default Routes;
