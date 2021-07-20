import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Error } from '_components/Error';

function PhotosSummary() {
  const [error, setError] = useState();
  const [photos, setPhotos] = useState([]);
  //photos data call 
  useEffect(() => {
    window.FB.api(
      "/me/photos",
      'GET',
      {"fields":"id,created_time,images"},
      function (response) {
        if (response && !response.error) {
          if (response.paging.next === undefined) {
            setPhotos(response.data);
          } else {
            getAllPhotos(response.paging.next, response.data);
          }
        } else {
          setError(response.error);
        }
      }
    );

    //call and set all the photos
    function getAllPhotos(next, data) {
      window.FB.api(
        next,
        'GET',
        {},
        function (response) {
          if (response && !response.error) {
            if (response.paging.next === undefined) {
              setPhotos(data.concat(response.data));
            } else {
              getAllPhotos(response.paging.next, data.concat(response.data));
            }
          } else {
            setError(response.error);
          }
        }
      );
    }
  }, []);

  function numberOfPhotosByDate(days) {
    if (photos.length === 0) return 'Loading Photos';
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const today = new Date();
    for (let i = 0; i < photos.length; i++) {
      if (dateDiffInDays(new Date(photos[i].created_time), today) >= days)
        return i;
    }
    return photos.length;
    
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
        <tr>
          <th>Time</th>
          <th>Number</th>
        </tr>
        <tr>
          <td>All Stored Photos</td>
          <td><NavLink exact to="/photos">{photos.length}</NavLink></td>
        </tr>
        <tr>
          <td>Past week Photos</td>
          <td>{numberOfPhotosByDate(7)}</td>
        </tr>
        <tr>
          <td>Past month Photos</td>
          <td>{numberOfPhotosByDate(30)}</td>
        </tr>
        <tr>
          <td>Past year Photos</td>
          <td>{numberOfPhotosByDate(365)}</td>
        </tr>
      </table>
    </div>
  );
}

export { PhotosSummary };