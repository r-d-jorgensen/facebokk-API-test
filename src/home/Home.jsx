import React, { useState, useEffect } from 'react';

function Home() {
    const [error, setError] = useState();
    const [feed, setFeed] = useState();
    const [account, setAccount] = useState();

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
        window.FB.api(
            '/me/feed',
            'GET',
            {"fields":"id,message,created_time,attachments"},
            function(response) {
                if (response && !response.error) {
                    setFeed(response.data);
                } else {
                    setError(response.error);
                }
            }
        );
    }, []);

    function AccountDisplay() {
        if (!account) return <h1>Loading Your Informaition account information</h1>;
        return (
            <div>
                <img src={account.picture.data.url} alt="" width={account.picture.data.width} height={account.picture.data.hight}></img>
                <h3>Facebook ID: {account.id}</h3>
                <h3>Facebook Name: {account.name}</h3>
                <h3>Facebook Email: {account.email}</h3>
            </div>
        );
        
    }

    function FeedDisplay() {
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
            } else if (attachments[0].type === 'life_event') {
                return (
                    <p>Life Event: {attachments[0].title}</p>
                )
            } else {
                console.log(attachments[0].type);
                console.log(attachments[0]);
                return (
                    <p>This attachment is not recognized</p>
                )
            }
        }

        function cleanTheDate(dateStr) {
            return new Date(dateStr).toISOString()
                .replace(/T/, ' ')
                .replace(/\..+/, '')
        }

        if (!feed) return <h3>Loading Your Facebook Feed</h3>;
        return (
            <div>
                <h3>Feed on Page 1:</h3>
                {feed.map((post, i) => <div key={i}>
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
        );
    }

    if (error) {
        return (
            <div>
                <h1>Error Has Happened in retrieving your data</h1>
                <h3>{error}</h3>
            </div>
        );
    }

    return (
        <div>
            <AccountDisplay />
            <FeedDisplay />
        </div>
    );
}

export { Home };