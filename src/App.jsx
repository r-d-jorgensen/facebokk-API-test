import React from 'react';
import { Route, Switch, Redirect} from 'react-router-dom';
import { Nav, PrivateRoute } from '_components';
import { UserInfo } from 'userInfo/UserInfo';
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
                    <Route path="/login" component={Login} />
                    <PrivateRoute exact path="/userInfo" component={UserInfo} />
                    <PrivateRoute path="/feed" component={Feed} />
                    <PrivateRoute path="/photos" component={Photos} />
                    <PrivateRoute path="/" component={PhotosSummary} />
                    <Redirect from="*" to="/" />
                </Switch>
            </div>
            <span style={{bottom: "0%", right: "0%", position: "fixed"}}>{process.env.REACT_APP_VERSION}</span>
        </div>
    );
}

export { App };