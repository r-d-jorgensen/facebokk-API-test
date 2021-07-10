import React, { useState, useEffect } from 'react';

function Home() {
    const [error, setError] = useState();
    const [account, setAccount] = useState();
    const [feed, setFeed] = useState();
    const [photos, setPhotos] = useState();

    //API calls start at load
    useEffect(() => {
        //account data call
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
        //feed data call
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
        //photos data call
        window.FB.api(
            "/me/photos",
            'GET',
            {"fields":"id,name,created_time,images"},
            function (response) {
                if (response && !response.error) {
                    setPhotos(response.data);
                } else {
                    setError(response.error);
                }
            }
        );
    }, []);

    //Turns t type to YYYY-MM-DD HH:MM:SS time type
    function cleanTheDate(dateStr) {
        return new Date(dateStr).toISOString()
            .replace(/T/, ' ')
            .replace(/\..+/, '')
    }

    //displays account info from API call
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

    //maps all posts of the user feed from the API call
    //no pagination so only page 1
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

        if (!feed) return <h3>Loading Your Facebook Feed</h3>;
        return (
            <div>
                <h3>Feed [Page 1]:</h3>
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

    //maps all photos from the API call
    //no pagination so only page 1
    function PhotoDisplay() {
        
        if (!photos) return <h3>Loading Your Facebook Photos</h3>
        return (
            <div>
                <h3>Photos [Page 1]:</h3>
                {photos.map(photo => <div key={photo.id}>
                    <p>Created on: {cleanTheDate(photo.created_time)}</p>
                    <img
                        src={photo.images[6].source}
                        alt={photo.name ? photo.name : ""}
                        width={photo.images[6].width}
                        height={photo.images[6].height} />,
                </div> )}
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

    //top level display location
    return (
        <div>
            <AccountDisplay />
            <FeedDisplay />
            <PhotoDisplay />
        </div>
    );
}

export { Home };