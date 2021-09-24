import React from 'react';
import { Route, Switch, Redirect} from 'react-router-dom';

import { Nav, PrivateRoute } from '_components';
import { UserInfo } from 'pages/userInfo/UserInfo';
import { Landing } from 'pages/landing/Landing';
import { Photos } from 'pages/photos/Photos';
import { Posts } from 'pages/photos/Posts';
import { PhotosSummary } from 'pages/photos/PhotosSummary';
import { Home } from 'pages/home/Home';

function App() {
    return (
        <div>
            <Nav />
            <div className="container pt-4">
                <Switch>
                    <Route exact path="/" component={Landing} />
                    <PrivateRoute exact path="/userInfo" component={UserInfo} />
                    <PrivateRoute path="/photos" component={Photos} />
                    <PrivateRoute path="/posts" component={Posts} />
                    <PrivateRoute exact path="/photosSummary" component={PhotosSummary} />
                    <PrivateRoute exact path="/home" component={Home} />
                    <Redirect from="*" to="/" />
                </Switch>
            </div>
            <span style={{bottom: "0%", right: "0%", position: "fixed"}}>ver {process.env.REACT_APP_VERSION}</span>
        </div>
    );
}

export { App };