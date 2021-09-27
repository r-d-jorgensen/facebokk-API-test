import { BehaviorSubject } from 'rxjs';

const accountSubject = new BehaviorSubject(null);

// HACK... this is used to simulate calling the server to auth the user
async function apiAuthenticate(accessToken) {
  const tokenPayload = {
    exp: Math.round(new Date(Date.now() + 15 * 60 * 1000).getTime() / 1000),
    id: accessToken,
  };
  const account = { token: `fake-jwt-token.${btoa(JSON.stringify(tokenPayload))}` };
  accountSubject.next(account);
  return account;
}

async function login() {
  // login with facebook then authenticate with the API to get a JWT auth token
  const { authResponse } = await new Promise((resolve, reject) => {
    window.FB.login((response) => {
      if (response.authResponse) {
        resolve(response);
      }
      reject(response.error);
    }, { scope: ['email', 'public_profile', 'user_posts', 'user_photos'] });
  });
  if (!authResponse) {
    console.log('Bad login with FB');
    return;
  }
  const tokenPayload = {
    exp: Math.round(new Date(Date.now() + 15 * 60 * 1000).getTime() / 1000),
    id: authResponse.accessToken,
  };
  accountSubject.next({ token: `fake-jwt-token.${btoa(JSON.stringify(tokenPayload))}` });
}

function logout() {
  // revoke app permissions to logout completely because FB.logout() doesn't remove FB cookie
  window.FB.api('/me/permissions', 'delete', null, () => window.FB.logout());
  accountSubject.next(null);
}

const accountService = {
  login,
  logout,
  apiAuthenticate,
  account: accountSubject.asObservable(),
  get accountValue() { return accountSubject.value; },
};

export default accountService;
