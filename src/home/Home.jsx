import React, { useState, useEffect } from 'react';
import { Error } from '_components/Error';

function Home() {
    const [error, setError] = useState();
    const [account, setAccount] = useState();

    ///account data call
    useEffect(() => {
        window.FB.api(
            '/me',
            'GET',
            {"fields":"id,name,email,picture"},
            function(response) {
                if (response && !response.error) {
                    setAccount(response);
                } else {
                    setError(response.error);
                }
            }
        );
    });

    if (!account) return <h1>Loading Your Informaition account information</h1>;
    if (error) return (<Error error={error} />);
    return (
        <div>
            <img src={account.picture.data.url} alt="" width={account.picture.data.width} height={account.picture.data.hight}></img>
            <h3>Facebook ID: {account.id}</h3>
            <h3>Facebook Name: {account.name}</h3>
            <h3>Facebook Email: {account.email}</h3>
        </div>
    );
}

export { Home };