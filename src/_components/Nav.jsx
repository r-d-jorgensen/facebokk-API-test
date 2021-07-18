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
            <div className="navbar-nav">
                <NavLink exact to="/" className="nav-item nav-link">Home</NavLink>
                <NavLink exact to="/photos" className="nav-item nav-link">Photos</NavLink>
                <NavLink exact to="/photosSummary" className="nav-item nav-link">Photos Summary</NavLink>
                <NavLink exact to="/feed" className="nav-item nav-link">Feed</NavLink>
                <button className="btn btn-link nav-item nav-link" onClick={accountService.logout}>Logout</button>
                <p className="nav-item nav-link">{process.env.REACT_APP_VERSION}</p>
            </div>
        </nav>
    );
}

export { Nav }; 