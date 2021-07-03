import React from 'react';
import { Route, Switch, Redirect} from 'react-router-dom';

import { Nav, PrivateRoute } from '_components';
import { Home } from 'home/Home';
import { Login } from 'login/Login';

function App() {

    return (
        <div>
            <Nav />
            <div className="container pt-4">
                <Switch>
                    <PrivateRoute exact path="/" component={Home} />
                    <Route path="/login" component={Login} />
                    <Redirect from="*" to="/" />
                </Switch>
            </div>
        </div>
    );
}

export { App };