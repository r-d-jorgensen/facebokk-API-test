import React, { useState, useEffect } from 'react';
import { NavLink, useHistory } from 'react-router-dom';

import accountService from '../_services/accountService';

export default function Nav() {
  const [account, setAccount] = useState(null);
  const history = useHistory();
  useEffect(() => {
    accountService.account.subscribe((x) => setAccount(x));
  }, []);

  async function logout() {
    // revoke app permissions to logout completely because FB.logout() doesn't remove FB cookie
    await accountService.logout();
    history.push('/');
  }

  // Only show nav when logged in
  if (!account) return null;

  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark">
      <div className="navbar-nav mr-auto">
        <NavLink exact to="/home" className="nav-item nav-link">Home</NavLink>
        <NavLink exact to="/photosSummary" className="nav-item nav-link">Photos Summary</NavLink>
        <NavLink exact to="/userInfo" className="nav-item nav-link">User Info</NavLink>
      </div>
      <button
        type="button"
        className="btn btn-link"
        style={{ alignItems: 'Right', color: 'gray' }}
        onClick={logout}
      >
        Logout
      </button>
    </nav>
  );
}
