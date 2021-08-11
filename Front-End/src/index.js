import React from 'react';
import { Router } from 'react-router-dom';
import { render } from 'react-dom';

// Global stylesheet
import './index.css';

import { initFacebookSdk, history } from './_helpers';
import { App } from './App';

// Wait for facebook sdk before startup
initFacebookSdk().then(startApp);

function startApp() { 
    render(
        <Router history={history}>
            <App />
        </Router>,
        document.getElementById('app')
    );
}