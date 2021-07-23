import React, { useEffect, useState } from 'react';
import { dateCleaner, facebookAPICall } from '_helpers';
import { Error } from '_components/Error';

function Posts() {
  const [error, setError] = useState();
  const [posts, setPosts] = useState();
  const [selectedPosts, setSelectedPosts] = useState([]);
  //photos data call
  useEffect(() => {
    //this call is reapeated from the summary page
    //data needs to be passed here not re-found
    getAllFeedPhotos();
    //iteratively calls feed endpoint till no more
    //repetitive code should be combined with above
    //this is hacked... needs to filter before data gets here waste of cycles
    async function getAllFeedPhotos() {
      const feilds = {"fields":"id,type,message,created_time,full_picture"}
      let url = "/me/posts";
      let posts = [];
      while (true) {
        const result = await facebookAPICall(url, feilds)
          .then(result => result)
          .catch(error => setError(error));
        if (result.data.length !== 0) posts = posts.concat(result.data.filter(post => post.type === 'photo'));
        if (result.hasOwnProperty('paging')) url = result.paging.next;
        else {
          setPosts(posts);
          return;
        }
      }
    }
  }, []);

  function toggleSelection(id) {
    if (selectedPosts.includes(id)) {
      setSelectedPosts(selectedPosts.filter(item => item !== id));
    } else {
      setSelectedPosts(selectedPosts.concat([id]));
    }
  }

  function toggleAll() {
    if (selectedPosts.length === posts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(posts.map(post => post.id))
    }
  } 

  if (!posts) return <h3>Loading Your Facebook Posts</h3>;
  if (error) return <Error error={error} />;
  if (posts.length === 0) return <h3>You don't have any posts avalible</h3>;
  return (
    <div>
      <h3>All Post Photos Ever</h3>
      <button onClick={toggleAll}>{selectedPosts.length === posts.length ? "Deselect All" : "Select All"}</button>
      <div style={{display: "grid", gridTemplateColumns: "auto auto auto auto", gridColumnGap: "10px", gridRowGap: "10px"}}>
        {posts.map(post =>
        <div
          key={post.id}
          onClick={() => toggleSelection(post.id)} 
          style={selectedPosts.includes(post.id) ? {border: "2px solid blue", borderRadius: "5px"} : {padding: "2px"}}>
          <img
            src={post.full_picture}
            alt={post.message ? post.message : ""}
            width={300}
            height={225} />
            <div>
              Created on: {dateCleaner(post.created_time)}
              <br />
              {post.message ? post.message : "No Message Given"}
            </div>
      </div>)}
      </div>
    </div>
  );
}

export { Posts };