import React, { useState, useEffect } from 'react';

function Home() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [account, setAccount] = useState({});
    const [feed, setFeed] = useState([]);

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
                window.FB.api(
                    '/me/feed',
                    'GET',
                    {"fields":"id,message,created_time,attachments"},
                    function(response) {
                        if (response && !response.error) {
                            setFeed(response.data);
                            console.log(response.data);
                        } else {
                            setError(response.error);
                        }
                    }
                );
                setLoading(false);
            }
        );
    }, []);
    
    function cleanTheDate(dateStr) {
        return new Date(dateStr).toISOString()
            .replace(/T/, ' ')
            .replace(/\..+/, '')
    }

    function postAttachments(attachments) {
        if (attachments[0].type === 'album') {
            return attachments[0].subattachments.data.map(subattachment => 
                <img
                    key={subattachment.target.id}
                    src={subattachment.media.image.src}
                    alt=""
                    width={subattachment.media.image.width}
                    height={subattachment.media.image.height} />
            )
        } else if (attachments[0].type === 'photo') {
            return (
                <img
                    src={attachments[0].media.image.src}
                    alt=""
                    width={attachments[0].media.image.width}
                    height={attachments[0].media.image.height} />
            )
        } else if (attachments[0].type === 'share') {
            return (
                <p>This is an shared Link: <a href={attachments[0].url}>{attachments[0].title}</a></p>
            )
        } else if (attachments[0].type === 'video_autoplay') {
            return (
                <p>This is ment to be a video and this type not yet supported</p>
            )
        } else {
            console.log(attachments[0].type);
            return (
                <p>This attachemnt is not recognized</p>
            )
        }
    }

    if (loading) {
        return (
            <div>
                <h1>Now Loading Your Informaition</h1>
            </div>
        );
    } else if (!error) {
        return (
            <div>
                <img src={account.picture.data.url} alt="" width={account.picture.data.width} height={account.picture.data.hight}></img>
                <h3>Facebook ID: {account.id}</h3>
                <h3>Facebook Name: {account.name}</h3>
                <h3>Facebook Email: {account.email}</h3>
                <div>
                    <h3>Feed on Page 1:</h3>
                    {feed.map(post => <div key={post.id}>
                        <h4>Post: {post.id}</h4>
                        <h6>Time Made: {cleanTheDate(post.created_time)}:</h6>
                        <h6>Message - </h6>
                        <p>{post.message}</p>
                        {post.hasOwnProperty('attachments') ?
                            <div>
                                <h6>Post's Attachments:</h6>
                                {postAttachments(post.attachments.data)}
                            </div>
                        : null}
                    </div>)}
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