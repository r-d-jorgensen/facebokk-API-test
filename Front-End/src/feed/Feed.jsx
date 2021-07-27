import React, { useEffect, useState } from 'react';
import { dateCleaner } from '_helpers';
import { Error } from '_components/Error';

function Feed() {
  const [error, setError] = useState();
  const [feed, setFeed] = useState();
  //feed data call
  useEffect(() => {
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
      return <p>This is an shared Link: <a href={attachments[0].url}>{attachments[0].title}</a></p>;
    } else if (attachments[0].type === 'video_autoplay') {
      return <p>This is ment to be a video and this type not yet supported</p>;
    } else if (attachments[0].type === 'life_event') {
      return <p>Life Event: {attachments[0].title}</p>;
    } else {
      console.log(attachments[0].type);
      console.log(attachments[0]);
      return <p>This attachment is not recognized</p>;
    }
  }

  if (!feed) return <h3>Loading Your Facebook Feed</h3>;
  if (error) return <Error error={error} />;
  return (
    <div>
      <h3>Feed [Page 1]:</h3>
      {feed.map((post, i) => <div key={i}>
        <h4>Post: {post.id}</h4>
        <h6>Time Made: {dateCleaner(post.created_time)}:</h6>
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

export { Feed };