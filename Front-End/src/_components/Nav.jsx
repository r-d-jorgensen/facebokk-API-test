import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import { accountService } from '_services';

function Nav() {
    const [account, setAccount] = useState(null);
    useEffect(() => {
        accountService.account.subscribe(x => setAccount(x));
    }, []);

    // only show nav when logged in
    if (!account) return null;

    return (
        <nav className="navbar navbar-expand navbar-dark bg-dark">
            <div className="navbar-nav mr-auto">
                <NavLink exact to="/" className="nav-item nav-link">Photos Summary</NavLink>
                <NavLink exact to="/userInfo" className="nav-item nav-link">User Info</NavLink>
            </div>
            <button className="btn btn-link" style={{alignItems: 'Right', color: "gray"}} onClick={accountService.logout}>Logout</button>
        </nav>
    );
}

export { Nav }; 