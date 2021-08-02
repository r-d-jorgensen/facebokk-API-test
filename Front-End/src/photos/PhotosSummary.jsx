import axios from 'axios';
import React, { useEffect, useState } from 'react';
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
    apiCall();
    async function apiCall() {
      const photos = await axios.get(`https://localhost:8080/photos`);
      console.log(photos);
      const posts = await axios.get(`https://localhost:8080/posts`);
      console.log(posts);
    }

    //iteratively calls photo endpoint till no more
    async function getAllPhotos() {
      const fields = {"fields":"id,created_time,images"}
      let url = "/me/photos";
      let photos = [];
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
          setAllPhotos(photos);
          window.sessionStorage.setItem("photos", JSON.stringify(photos));
          setLoadingPhotos(false);
          return;
        }
      }
    }

    //iteratively calls feed endpoint till no more
    //HACK... needs to filter before data gets here waste of cycles
    async function getAllFeedPhotos() {
      const fields = {"fields":"id,type,message,created_time,full_picture"}
      let url = "/me/posts";
      let posts = [];
      //to limit the number of call temperaraly
      let i = 0;
      while (i < 3) {
        i += 1;
        const result = await facebookAPICall(url, fields)
          .then(result => result)
          .catch(error => setError(error));
        if (result.hasOwnProperty('data') && result.data.length !== 0) posts = posts.concat(result.data.filter(post => post.type === 'photo'));
        if (result.hasOwnProperty('paging') && result.paging.hasOwnProperty('next')) url = result.paging.next;
        else {
          window.sessionStorage.setItem("posts", JSON.stringify(posts));
          setAllPosts(posts);
          setLoadingPosts(false);
          return;
        }
      }
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
            <td>All Stored Photos</td>
            <td><NavLink to="/photos">{loadingPhotos ? 'Loading Photos' : allPhotos.length}</NavLink></td>
            <td><NavLink to="/posts">{loadingPosts ? 'Loading Posts' : allPosts.length}</NavLink></td>
          </tr>
          <tr>
            <td>Past week Photos</td>
            <td>{loadingPhotos ? 'Loading Photos' : numberOfPhotosByDate(7, allPhotos)}</td>
            <td>{loadingPosts ? 'Loading Posts' : numberOfPhotosByDate(7, allPosts)}</td>
          </tr>
          <tr>
            <td>Past month Photos</td>
            <td>{loadingPhotos ? 'Loading Photos' : numberOfPhotosByDate(30, allPhotos)}</td>
            <td>{loadingPosts ? 'Loading Posts' : numberOfPhotosByDate(30, allPosts)}</td>
          </tr>
          <tr>
            <td>Past year Photos</td>
            <td>{loadingPhotos ? 'Loading Photos' : numberOfPhotosByDate(365, allPhotos)}</td>
            <td>{loadingPosts ? 'Loading Posts' : numberOfPhotosByDate(365, allPosts)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export { PhotosSummary };