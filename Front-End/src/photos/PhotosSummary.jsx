import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

import { accountService } from '_services';
import { facebookAPICall } from '_helpers';

// TODO: Create more expanitive error statments
function PhotosSummary() {
  const [user, setUser] = useState();
  const [photos, setPhotos] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // Get all photos in feed and photos sections
  useEffect(() => {
    const user = JSON.parse(window.sessionStorage.getItem("user"));
    setUser(user);
    // TODO: these FB calls are effectively the same and could be combined with a flag differentiating
    // TODO: move FB calls to server leaving only the server calls
    // TODO: Synconize calls should be a get type call to server
    // TODO: Data check the validity of synconized data
    syncronizePhotos(user);
    syncronizePosts(user);

    //Syncronizes and gets photo data from and with the DB and FB servers
    async function syncronizePhotos(user) {
      const fields = {"fields":"id,created_time,images,name"};
      const url = "/me/photos";
      const savedPhotoData = await axios.get(`https://localhost:8080/photos/facebook/${user.user_id}`) // TODO: Should be turned into a promise
        .then(savedPhotoData => savedPhotoData)
        .catch(error => console.log(error)); // TODO: log error with server when moved to server
      const newPhotoData = await getNewFBData(user, 'photo', fields, url);
      // Failed to load new data from FB
      if (newPhotoData.error) {
        console.log(newPhotoData.error)// TODO: log error with server when moved to server
        setPhotos(savedPhotoData.data);
        setLoadingPhotos(false);
        return;
      }

      const allPhotos = savedPhotoData.data.concat(newPhotoData.newData); //TODO: Remove when posted photos works
      axios.post(`https://localhost:8080/photos/facebook/${user.user_id}`, {
        photos: newPhotoData.newData,
        deepest_checkpoint: newPhotoData.deepest_checkpoint,
        passedSyncs: newPhotoData.passedSyncs,
      });
      setPhotos(allPhotos);
      setLoadingPhotos(false);
      return;
    }

    //Syncronizes and gets post data from and with the DB and FB servers
    async function syncronizePosts(user) {
      const fields = {"fields":"id,type,message,created_time,attachments"};
      const url = "/me/posts";
      const savedPostData = await axios.get(`https://localhost:8080/posts/facebook/${user.user_id}`);
      const newPostData = await getNewFBData(user, 'post', fields, url);
      // Failed to load new data from FB
      // TODO: Tell user that it failed and why
      if (savedPostData.error) {
        console.log(savedPostData.error)// TODO: log error with server when moved to server
        setPosts(savedPostData.data);
        setLoadingPosts(false);
        return;
      }

      // HACK: only being done to count the number of images correctly
      const newPostImages = [];
      newPostData.newData.forEach((post) => {
        post.images.forEach((image) => {
          newPostImages.push({
            created_at: post.created_at,
            src_link: image.src_link,
            height: image.height,
            width: image.width,
          });
        });
      });

      const allPosts = savedPostData.data.concat(newPostImages);
      axios.post(`https://localhost:8080/posts/facebook/${user.user_id}`, {
        posts: newPostData.newData,
        deepest_checkpoint: newPostData.deepest_checkpoint,
        passedSyncs: newPostData.passedSyncs,
      });
      setPosts(allPosts);
      setLoadingPosts(false);
      return;
    }

    // Retrives new data from FB servers
    async function getNewFBData(user, format, fields, url) {
      let newData = [];
      let passedSyncs = []; // For diging into past syncs that did not reach the floor... TODO: rename
      // TODO: move up to repective synco calls
      const syncData = await axios.get(`https://localhost:8080/sync/${format}/facebook/${user.user_id}`)
        .then(syncData => syncData)
        .catch(error => console.log(error)); // TODO: log error with server when moved to server
      const throtleAmount = 5; // TODO: Get the throtle amount from DB or calculate it
      
      for (let i = 0; i < throtleAmount; i++) {
        const fbData = await facebookAPICall(url, fields)
          .then(fbData => fbData)
          .catch(error => {return {isError: true, error}});
        // TODO: log error with server when moved to server
        if (fbData.isError) {
          if (fbData.error.type === 'OAuthException') return {error: fbData.error, log: `FB timed out on the ${i} call deep to FB api`};
          return {error: fbData.error, log: `Unkown Error`};
        }
        
        const {verifiedData, urlReached, newPassedSyncs} = verifyNewFBData(format, fbData.data, syncData.data, passedSyncs);
        newData = newData.concat(verifiedData);

        if (newPassedSyncs !== passedSyncs) { // If moved to previous sync checkpoint
          url = urlReached;
          passedSyncs = newPassedSyncs;
        } else if (urlReached === 'not floor' && fbData.hasOwnProperty('paging') && fbData.paging.hasOwnProperty('next')) { // If call has not reached a checkpoint or floor
          url = fbData.paging.next;
        } else return {newData: newData, deepest_checkpoint: 'floor', passedSyncs}; // If no more data to find
      }
      // TODO: Replace 'floor' with url when deeper sync implemented
      return {newData: newData, deepest_checkpoint: 'floor', passedSyncs}; // If user out of calls to FB
    }

    // Checks data against last synco point for FB data
    // TODO: have more data verification in here not just synco verifacation
    function verifyNewFBData(format, data, syncronizations, passedSyncs) {
      const verifiedData = [];
      for (let j = 0; j < data.length; j++) {
        if (
          syncronizations.length === 0 || //If no syncs or sync is older than datapoint
          new Date(syncronizations[syncronizations.length - 1]).getTime() < new Date(data[j].created_time).getTime()
        ) {
          const formatedData = formatNewData(format, data[j]);
          if (formatedData) verifiedData.push(formatedData);
          else continue;
        } else if (syncronizations[syncronizations.length - 1].deepest_checkpoint === 'floor') { // Found sync that reached the floor
          return {verifiedData: verifiedData, urlReached: 'floor', newPassedSyncs: passedSyncs};
        } else {// Found sync that did not reach the floor
          // TODO: Implement pseudo bellow
            //record current sync for deletion in passedSyncs as sync_id
            //if sync before current exists set as current sync
            //if no sync all before are new
          //newPassedSyncs = passedSyncs.concat([syncronizations[syncronizations.length - 1].sync_id]);
          //return {verifiedData: verifiedData, urlReached: 'floor', newPassedSyncs: newPassedSyncs};
          return {verifiedData: verifiedData, urlReached: 'floor', newPassedSyncs: passedSyncs}; // assuming last sync reached the floor... remove on implemnt above
        }
      }
      return {verifiedData: verifiedData, urlReached: 'not floor', newPassedSyncs: passedSyncs}
    }
    
    // Restructures data to DB format
    // TODO: Restructure data in synco and make each thier own function for less switching and var passing
    function formatNewData(format, data) {
      // TODO: Needs data more verification
      switch (format) {
        case 'photo':
          return {
            src_link: data.images[0].source,
            height: data.images[0].height,
            width: data.images[0].width,
            caption: data.name ? data.name : null,
            created_at: new Date(data.created_time).toISOString(),
          };
        case 'post':
          // TODO: implement more post type data structures
          // Filters out all non-photo and album types
          if (data.type !== 'photo') {
            //console.log(`Type ${data.type} is currently not supported`);
            return null;
          }
          switch (data.attachments.data[0].type) {
            case 'photo':
              return {
                type: 2,
                origin: 1,
                created_at: new Date(data.created_time).toISOString(),
                message: data.message ? data.message : null,
                images: [{
                  src_link: data.attachments.data[0].media.image.src,
                  height: data.attachments.data[0].media.image.height,
                  width: data.attachments.data[0].media.image.width,
                }]
              };
            case 'album':
              return {
                type: 2,
                origin: 1,
                created_at: new Date(data.created_time).toISOString(),
                message: data.message ? data.message : null,
                images: data.attachments.data[0].subattachments.data.map((image) => {
                  return {
                    src_link: image.media.image.src,
                    height: image.media.image.height,
                    width: image.media.image.width,
                  }
                }),
              }
            default:
              return null;
          }
        default:
          console.log(`Format type ${format} is not currently supported`);
          return null;
      }
    }
  }, []);

  // TODO: Ask for conformation before firing the full delete
  function deleteUser() {
    axios.delete(`https://localhost:8080/user/${user.user_id}`);
    window.sessionStorage.clear();
    accountService.logout();
  }

  return (
    <div>
      <h1>Your Photos Stored in Facebook</h1>
      <button onClick={deleteUser}>DELETE USER DATA</button>
      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>Photos</th>
            <th>Post Images</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>All Stored</td>
            <td><NavLink to="/photos">{loadingPhotos ? 'Loading Photos' : photos.length}</NavLink></td>
            <td><NavLink to="/posts">{loadingPosts ? 'Loading Posts' : posts.length}</NavLink></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export { PhotosSummary };