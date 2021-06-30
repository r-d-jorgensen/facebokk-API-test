import React, { useState, useEffect } from 'react';

function Home() {
    const [account, setAccount] = useState();
    const [email, setEmail] = useState();

    useEffect(() => {
        window.FB.api(
            '/me',
            'GET',
            {"fields":"id,name"},
            function(response) {
                setAccount(response);
            }
        );
        window.FB.api(
            '/me',
            'GET',
            {"fields":"email"},
            function(response) {
                setEmail(response.email)
            }
        );
    }, []);

    return (
        <div>
            <h3>Facebook ID: {account.id}</h3>
            <h3>Facebook Name: {account.name}</h3>
            <h3>Facebook Email: {email}</h3>
        </div>
    );
}

export { Home };