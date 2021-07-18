import React from 'react';
import { Route, Switch, Redirect} from 'react-router-dom';
import { Nav, PrivateRoute } from '_components';
import { Home } from 'home/Home';
import { Login } from 'login/Login';
import { Feed } from 'feed/Feed';
import { Photos } from 'photos/Photos';
import { PhotosSummary } from 'photos/PhotosSummary';

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
                    <Route path="/photosSummary" component={PhotosSummary} />
                    <Redirect from="*" to="/" />
                </Switch>
            </div>
        </div>
    );
}

export { App };