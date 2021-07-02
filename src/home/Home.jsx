import React, { useState, useEffect } from 'react';

function Home() {
    const [error, setError] = useState("")
    const [sucess, setSucess] = useState(0)
    const [account, setAccount] = useState({});

    useEffect(() => {
        window.FB.api(
            '/me',
            'GET',
            {"fields":"id,name,email,picture,gender"},
            function(response) {
                if (response && !response.error) {
                    setAccount(response);
                    setSucess(1);
                    console.log(response);
                } else {
                    setError(response.error);
                    setSucess(0);
                }
            }
        );
    }, []);
    if (sucess) {
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