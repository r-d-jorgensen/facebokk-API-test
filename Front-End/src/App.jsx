import React from 'react';
import {
  Route,
  Switch,
  Redirect,
  BrowserRouter as Router,
} from 'react-router-dom';

import Nav from './_components/Nav';
import PrivateRoute from './_components/PrivateRoute';
import UserInfo from './_pages/user/UserInfo';
import Landing from './_pages/guest/Landing';
import Photos from './_pages/user/Photos';
import Posts from './_pages/user/Posts';
import PhotosSummary from './_pages/user/PhotosSummary';
import Home from './_pages/user/Home';

export default function App() {
  return (
    <Router>
      <Nav />
      <div>
        <Switch>
          <Route exact path="/" component={Landing} />
          <PrivateRoute exact path="/userInfo" component={UserInfo} />
          <PrivateRoute exact path="/photos" component={Photos} />
          <PrivateRoute exact path="/posts" component={Posts} />
          <PrivateRoute exact path="/photosSummary" component={PhotosSummary} />
          <PrivateRoute exact path="/home" component={Home} />
          <Redirect from="*" to="/" />
        </Switch>
      </div>
      <span style={{ bottom: '0%', right: '0%', position: 'fixed' }}>
        ver
        {process.env.REACT_APP_VERSION}
      </span>
    </Router>
  );
}
