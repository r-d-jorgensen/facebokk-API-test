import React from 'react';
import { Route, Switch, Redirect} from 'react-router-dom';
import { Nav, PrivateRoute } from '_components';
import { Home } from 'home/Home';
import { Login } from 'login/Login';
import { Feed } from 'feed/Feed';
import { Photos } from 'photos/Photos';

function App() {
    return (
        <div>
            <Nav />
            <div className="container pt-4">
                <Switch>
                    <PrivateRoute exact path="/" component={Home} />
                    <Route path="/login" component={Login} />
                    <Route path="/feed" component={Feed} />
                    <Route path="/photos" component={Photos} />
                    <Redirect from="*" to="/" />
                </Switch>
            </div>
        </div>
    );
}

export { App };