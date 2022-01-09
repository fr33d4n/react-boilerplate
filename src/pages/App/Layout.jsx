import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';

import { Spinner } from 'components';
import { parse } from 'qs';

import history from '@services/history';
import routes from '@routes/routerComponents';

import { fetchCurrencies as fetchCurrenciesAction, iniciarSubproceso as iniciarSubprocesoAction } from './Layout.actions';

function Layout({ params }) {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <ConnectedRouter history={history}>
            {isLoading ? (
                <Spinner />
            ) : (
                <Switch>
                    {routes.map((r) => (
                        <Route key={r.path} exact={r.exact || false} path={r.path} component={r.component} />
                    ))}
                </Switch>
            )}
        </ConnectedRouter>
    );
}

Layout.propTypes = {
    fetchCurrencies: PropTypes.func.isRequired,
    iniciarSubproceso: PropTypes.func.isRequired,
    params: PropTypes.shape({
        param1: PropTypes.string,
        param2: PropTypes.number,
    }),
    search: PropTypes.shape({}).isRequired,
};

Layout.defaultProps = {
    params: {},
};

export default connect(
    (store) => ({
        search: parse(store.router.location.search.slice(1)),
    }),
    (_) => ({}),
)(Layout);
