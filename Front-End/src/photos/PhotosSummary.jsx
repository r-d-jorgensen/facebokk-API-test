import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { Error } from '_components/Error';
import { facebookAPICall } from '_helpers';

function PhotosSummary() {
  const [error, setError] = useState();
  const [allPhotos, setAllPhotos] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);

  //find all photos in feed and photos sections
  useEffect(() => {
    getAllPhotos();
    getAllFeedPhotos();

    //iteratively calls photo endpoint till no more
    async function getAllPhotos() {
      //need call to sync tabble
      //use for syncro and when facebooks calls are moved to server
      //const data = await axios.get(`https://localhost:8080/facebook/photos/${1}`);
      //console.log(data)
      const fields = {"fields":"id,created_time,images"};
      let url = "/me/photos";
      let photos = [];
      //there should be a check to tell when it reached the last sync point
      while (true) {
        const result = await facebookAPICall(url, fields)
          .then(result => result)
          .catch(error => setError(error));
        if (!result) {
          setError("Facebook Returned Bad Data.");
          return;
        }
        if (result.data.length !== 0) photos = photos.concat(result.data);
        if (result.hasOwnProperty('paging') && result.paging.hasOwnProperty('next')) url = result.paging.next;
        else {
          //reactivate with syncro
          //axios.post(`https://localhost:8080/facebook/photos/${1}`, {data: photos});
          window.sessionStorage.setItem("photos", JSON.stringify(photos));
          setAllPhotos(photos);
          setLoadingPhotos(false);
          return;
        }
      }
    }

    //iteratively calls feed endpoint till no more
    async function getAllFeedPhotos() {
      //need call to sync tabble
      //use for syncro and when facebooks calls are moved to server
      const data = await axios.get(`https://localhost:8080/facebook/posts/${1}`);
      console.log(data)
      const fields = {"fields":"id,type,message,created_time,attachments"}
      let url = "/me/posts";
      let posts = [];
      var temp_id = 0 //this id is just to keep the selection system running on posts
      let i = 0; //to limit the number of calls temperaraly
      while (i < 1) {
        i += 1;
        const result = await facebookAPICall(url, fields)
          .then(result => result)
          .catch(error => setError(error));
        if (result.hasOwnProperty('data') && result.data.length !== 0) {
          //only working with photo type posts rn
          posts = posts.concat(...result.data.filter(post => post.type === 'photo').map((post) => {
            temp_id += 1; //this should be removed latter
            switch (post.attachments.data[0].type) {
              case 'photo':
                return [{
                  id: temp_id,
                  type: 2,
                  origin: 1,
                  created_at: post.created_time,
                  message: post.message,
                  images: [{
                    src_link: post.attachments.data[0].media.image.src,
                    height: post.attachments.data[0].media.image.height,
                    width: post.attachments.data[0].media.image.width,
                  }]
                }];
              case 'album':
                return  {
                  id: temp_id,
                  type: 2,
                  origin: 1,
                  created_at: post.created_time,
                  message: post.message,
                  images: post.attachments.data[0].subattachments.data.map((image) => {
                    return {
                      src_link: image.media.image.src,
                      height: image.media.image.height,
                      width: image.media.image.width,
                    }
                  })
                }
              default:
                return {
                  error: `Type ${post.attachments.data[0].type} is currently not supported`
                }
            }
          }));
        };
        if (result.hasOwnProperty('paging') && result.paging.hasOwnProperty('next')) url = result.paging.next;
        else {
          //this will be removed with the facebook calls being pushed to the server
          //console.log(posts)
          //axios.post(`https://localhost:8080/facebook/posts/${1}`, {data: posts});
          window.sessionStorage.setItem("posts", JSON.stringify(posts));
          setAllPosts(posts);
          setLoadingPosts(false);
          return;
        }
      }
      console.log(posts)
      //axios.post(`https://localhost:8080/facebook/posts/${1}`, {data: posts});
      window.sessionStorage.setItem("posts", JSON.stringify(posts));
      setAllPosts(posts);
      setLoadingPosts(false);
    }
  }, []);

  function numberOfPhotosByDate(days, data) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const today = new Date();
    for (let i = 0; i < data.length; i++) {
      if (dateDiffInDays(new Date(data[i].created_time), today) >= days)
        return i;
    }
    return data.length;
    
    // a and b are javascript Date objects
    function dateDiffInDays(a, b) {
      // Discard the time and time-zone information.
      const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
      const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

      return Math.floor((utc2 - utc1) / _MS_PER_DAY);
    }
  }

  if (error) return <Error error={error} />;
  return (
    <div>
      <h1>Your Photos Stored in Facebook</h1>
      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>Photos</th>
            <th>Posts</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>All Stored</td>
            <td><NavLink to="/photos">{loadingPhotos ? 'Loading Photos' : allPhotos.length}</NavLink></td>
            <td><NavLink to="/posts">{loadingPosts ? 'Loading Posts' : allPosts.length}</NavLink></td>
          </tr>
          <tr>
            <td>Past week</td>
            <td>{loadingPhotos ? 'Loading Photos' : numberOfPhotosByDate(7, allPhotos)}</td>
            <td>{loadingPosts ? 'Loading Posts' : numberOfPhotosByDate(7, allPosts)}</td>
          </tr>
          <tr>
            <td>Past month</td>
            <td>{loadingPhotos ? 'Loading Photos' : numberOfPhotosByDate(30, allPhotos)}</td>
            <td>{loadingPosts ? 'Loading Posts' : numberOfPhotosByDate(30, allPosts)}</td>
          </tr>
          <tr>
            <td>Past year</td>
            <td>{loadingPhotos ? 'Loading Photos' : numberOfPhotosByDate(365, allPhotos)}</td>
            <td>{loadingPosts ? 'Loading Posts' : numberOfPhotosByDate(365, allPosts)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export { PhotosSummary };