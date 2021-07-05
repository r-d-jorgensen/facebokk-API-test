import React, { useState, useEffect } from 'react';

function Home() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [sucess, setSucess] = useState(false);
    const [account, setAccount] = useState({});
    const [feed, setFeed] = useState({});

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
                window.FB.api(
                    '/me/feed',
                    'GET',
                    {"fields":"id,message,created_time,attachments"},
                    function(response) {
                        if (response && !response.error) {
                            setFeed(response);
                            setSucess(true);
                        } else {
                            setError(response.error);
                            setSucess(false);
                        }
                        setLoading(false);
                    }
                );
            }
        );
    }, []);
    
    function cleanTheDate(dateStr) {
        return new Date(dateStr).toISOString()
            .replace(/T/, ' ')
            .replace(/\..+/, '')
    }

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
                <div>
                    <h3>Feed on Page 1</h3>
                    {Object.keys(feed.data).map(i => 
                        <div key={i}>
                            <p>Post Time {cleanTheDate(feed.data[i].created_time)}: {feed.data[i].message}</p>
                            {!feed.data[i].hasOwnProperty('attachments') ? null : Object.keys(feed.data[i].attachments.data).map(j => {
                                if (feed.data[i].attachments.data[j].type === 'photo')
                                    return <img
                                        key={j}
                                        src={feed.data[i].attachments.data[j].media.image.src}
                                        alt=""
                                        width={feed.data[i].attachments.data[j].media.image.width}
                                        height={feed.data[i].attachments.data[j].media.image.height} />
                                else if (feed.data[i].attachments.data[j].type === 'video')
                                    return <p key={j}>Video</p>
                                else 
                                    return <p key={j}>Other Attachment</p>
                            })}
                        </div>
                    )}
                </div>
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