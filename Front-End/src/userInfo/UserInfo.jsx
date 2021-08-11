import React, { useState, useEffect } from 'react';
import { Error } from '_components/Error';

function UserInfo() {
    const [error, setError] = useState();
    const [account, setAccount] = useState();
    // account data call
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
    }, []);

    if (!account) return <h1>Loading Your Informaition account information</h1>;
    if (error) return <Error error={error} />;
    return (
        <div>
            <img src={account.picture.data.url} alt="" width={account.picture.data.width} height={account.picture.data.hight}></img>
            <p><br /></p>
            <h3 style={{color: "red"}}>Facebook Name:</h3>
            <h3>{account.name}</h3>
            <h3 style={{color: "red"}}>Facebook Email:</h3>
            <h3>{account.email}</h3>
        </div>
    );
}

export { UserInfo };