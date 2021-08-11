import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { accountService } from '_services';

function PrivateRoute({ component: Component, ...rest }) {
    return (
        <Route {...rest} render={props => {
            const account = accountService.accountValue;
            if (!account) {
                return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
            }
            return <Component {...props} />
        }} />
    );
}

export { PrivateRoute };