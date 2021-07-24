import React, { useEffect, useState } from 'react';
import { dateCleaner } from '_helpers';

//HACK... fix when refactor
//this entire page should be refactored with the Photos page into one component or they should do diffrent things
function Posts() {
  const [posts, setPosts] = useState();
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [displayType, setDisplayType] = useState(1); //should have ENUM
  const displayTypes = [
    {collumns: "auto auto auto", width: 400, height: 325},
    {collumns: "auto auto auto auto", width: 300, height: 225},
    {collumns: "auto auto auto auto auto", width: 200, height: 125},
  ]
  //photos data call
  useEffect(() => {
    setPosts(JSON.parse(window.sessionStorage.getItem("posts")));
  }, []);

  //toggles individual photo selection
  function toggleSelection(id) {
    if (selectedPosts.includes(id)) {
      setSelectedPosts(selectedPosts.filter(item => item !== id));
    } else {
      setSelectedPosts(selectedPosts.concat([id]));
    }
  }

  //toggles all photos
  function togglePhotos() {
    if (selectedPosts.length === posts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(posts.map(post => post.id))
    }
  }

  function toggleSizes(e) {
    setDisplayType(e.target.value);
  }

  if (!posts) return <h3>Loading Your Facebook Posts</h3>;
  if (posts.length === 0) return <h3>You don't have any posts avalible</h3>;
  return (
    <div>
      <h3>All Post Photos Ever</h3>
      <button onClick={togglePhotos}>{selectedPosts.length === posts.length ? "Deselect All" : "Select All"}</button>
      <button value={2} onClick={toggleSizes}>Small</button>
      <button value={1} onClick={toggleSizes}>Medium</button>
      <button value={0} onClick={toggleSizes}>Large</button>
      <div style={{display: "grid", gridTemplateColumns: displayTypes[displayType].collumns, gridColumnGap: "10px", gridRowGap: "10px"}}>
        {posts.map(post =>
        <div
          key={post.id}
          onClick={() => toggleSelection(post.id)} 
          style={selectedPosts.includes(post.id) ? {border: "2px solid blue", borderRadius: "5px"} : {padding: "2px"}}>
          <img
            src={post.full_picture}
            alt={post.message ? post.message : ""}
            width={displayTypes[displayType].width}
            height={displayTypes[displayType].height} />
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