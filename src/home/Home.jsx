import React, { useState, useEffect } from 'react';
import { accountService } from '_services';

function Home() {
    const [account, setAccount] = useState([]);

    useEffect(() => {
        window.FB.api(
            '/me',
            'GET',
            {"fields":"id,name"},
            function(response) {
                setAccount(response);
            }
        );
    }, []);

    return (
        <div>
            <h3>Facebook ID: {account.id}</h3>
            <h3>Facebook Name: {account.name}</h3>
        </div>
    );
}

export { Home };