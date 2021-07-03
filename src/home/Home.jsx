import React, { useState, useEffect } from 'react';

function Home() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [sucess, setSucess] = useState(false);
    const [account, setAccount] = useState({});

    useEffect(() => {
        window.FB.api(
            '/me',
            'GET',
            {"fields":"id,name,email,picture"},
            function(response) {
                if (response && !response.error) {
                    setAccount(response);
                    setSucess(true);
                } else {
                    setError(response.error);
                    setSucess(false);
                }
                setLoading(false);
            }
        );
    }, []);
    
    if (loading) {
        return (
            <div>
                <h1>Now Loading Your Informaition</h1>
            </div>
        );
    } else if (sucess) {
        return (
            <div>
                <img src={account.picture.data.url} alt="" width={account.picture.data.width} height={account.picture.data.hight}></img>
                <h3>Facebook ID: {account.id}</h3>
                <h3>Facebook Name: {account.name}</h3>
                <h3>Facebook Email: {account.email}</h3>
            </div>
        );
    } else {
        return (
            <div>
                <h1>Error Has Happened</h1>
                <h3>{error}</h3>
            </div>
        );
    }
}

export { Home };