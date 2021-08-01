import { BehaviorSubject } from 'rxjs';
import { history } from '_helpers';

const accountSubject = new BehaviorSubject(null);

export const accountService = {
    login,
    apiAuthenticate,
    logout,
    account: accountSubject.asObservable(),
    get accountValue () { return accountSubject.value; }
};

async function login() {
    // login with facebook then authenticate with the API to get a JWT auth token
    const { authResponse } = await new Promise((resolve, reject) => {
        window.FB.login(function(response) {
            response.authResponse ? resolve(response) : reject('Error');
        }, {scope: ['email', 'public_profile', 'user_posts', 'user_photos']});
    });
    if (!authResponse) return;
    await apiAuthenticate(authResponse.accessToken);
    // get return url from location state or default to home page
    const { from } = history.location.state || { from: { pathname: "/" } };
    history.push(from);
}

// HACK... this is used to simulate calling the server to auth the user
async function apiAuthenticate(accessToken) {
    const tokenPayload = { 
        exp: Math.round(new Date(Date.now() + 15*60*1000).getTime() / 1000),
        id: accessToken,
    };
    const account = { token: `fake-jwt-token.${btoa(JSON.stringify(tokenPayload))}` };
    accountSubject.next(account);
    startAuthenticateTimer();
    return account;
}

function logout() {
    // revoke app permissions to logout completely because FB.logout() doesn't remove FB cookie
    window.FB.api('/me/permissions', 'delete', null, () => window.FB.logout());
    stopAuthenticateTimer();
    accountSubject.next(null);
    history.push('/login');
}

// helper methods
let authenticateTimeout;

function startAuthenticateTimer() {
    // parse json object from base64 encoded jwt token
    const jwtToken = JSON.parse(atob(accountSubject.value.token.split('.')[1]));

    // set a timeout to re-authenticate with the api one minute before the token expires
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - (60 * 1000);
    const { accessToken } = window.FB.getAuthResponse();
    authenticateTimeout = setTimeout(() => apiAuthenticate(accessToken), timeout);
}

function stopAuthenticateTimer() {
    // cancel timer for re-authenticating with the api
    clearTimeout(authenticateTimeout);
}