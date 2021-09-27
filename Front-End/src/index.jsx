import React from 'react';
import { render } from 'react-dom';

import initFacebookSdk from './_helpers/init-facebook-sdk';
import App from './App';

// Global stylesheet
import './index.css';

function startApp() {
  render(
    <App />,
    document.getElementById('app'),
  );
}

initFacebookSdk().then(startApp);
