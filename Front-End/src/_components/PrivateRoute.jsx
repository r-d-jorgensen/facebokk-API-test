/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import accountService from '../_services/accountService';

export default function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => {
        const account = accountService.accountValue;
        if (!account) {
          return <Redirect to={{ pathname: '/' }} />;
        }
        return <Component {...props} />;
      }}
    />
  );
}
